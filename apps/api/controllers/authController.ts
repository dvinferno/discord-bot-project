import { randomUUID } from "crypto";
import querystring from "querystring";
import type { Request, Response } from "express";
import type {
    RESTPostOAuth2AccessTokenResult,
} from "discord-api-types/v10";

type OAuth2TokenError = {
    error: string;
    error_description?: string;
};

const FRONTEND_URL = "http://localhost:5173";

export async function startDiscordAuth(_: Request, res: Response) {
    try {
        const state = randomUUID();

        // Set the state cookie for CSRF protection
        res.cookie("oauth_state", state, {
            httpOnly: true,
            sameSite: "lax", // safer cookie handling
            secure: Bun.env.NODE_ENV === "production", // only send over HTTPS in production
        });

        const params = querystring.stringify({
            client_id: Bun.env.APP_ID,
            grant_type: "authorization_code",
            redirect_uri: Bun.env.DISCORD_REDIRECT_URI,
            response_type: "code",
            scope: "identify email guilds",
            state,
        });

        const discordAuthUrl = `https://discord.com/api/oauth2/authorize?${params}`;

        return res.redirect(discordAuthUrl);
    } catch (err) {
        console.error("Error generating Discord OAuth2 URL:", err);
        return res.status(500).send("Failed to initiate authentication.");
    }
}

export async function handleDiscordCallback(req: Request, res: Response) {
    const code = req.query.code as string;
    const state = req.query.state;

    if (!code || !state) {
        return res.status(400).send("Invalid OAuth state.");
    }

    try {
        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: querystring.stringify({
                client_id: Bun.env.APP_ID,
                client_secret: Bun.env.CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: Bun.env.DISCORD_REDIRECT_URI,
            }),
        });

        const responseData = await tokenRes.json();

        if (!tokenRes.ok) {
            const errorData = responseData as OAuth2TokenError;
            console.error("Error from Discord token endpoint:", errorData);
            throw new Error(
                `Discord API error: ${errorData.error_description || errorData.error
                }`,
            );
        }

        const tokenData = responseData as RESTPostOAuth2AccessTokenResult;

        console.log("Token data:", tokenData);

        // Store tokens in secure cookies
        res.cookie("auth_token", tokenData.access_token, {
            httpOnly: true,
            sameSite: "lax",
        });
        res.cookie("refresh_token", tokenData.refresh_token, {
            httpOnly: true,
            sameSite: "lax",
        });

        res.redirect(FRONTEND_URL);
    } catch (err) {
        console.error("Authorization error:", err);
        res.status(500).send("Failed to authorize.");
    }
}

export async function validateAccessToken(req: Request, res: Response) {
    let accessToken = req.cookies.auth_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken) {
        return res
            .status(401)
            .json({ authenticated: false, message: "Not authenticated." });
    }

    try {
        // Step 1: Try to fetch the user with the current access token
        let userRes = await fetch("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Step 2: If access token is invalid or expired, try to refresh
        if (userRes.status === 401 && refreshToken) {
            const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: querystring.stringify({
                    client_id: process.env.APP_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                    redirect_uri: process.env.DISCORD_REDIRECT_URI,
                }),
            });

            const responseData = await tokenRes.json();

            if (!tokenRes.ok) {
                const errorData = responseData as OAuth2TokenError;
                console.error("Error from Discord token endpoint:", errorData);
                throw new Error(
                    `Discord API error: ${errorData.error_description || errorData.error
                    }`,
                );
            }

            const tokenData = responseData as RESTPostOAuth2AccessTokenResult;

            if (!tokenRes.ok || !tokenData.access_token) {
                throw new Error("Token refresh failed.");
            }

            // Update cookies with new tokens
            accessToken = tokenData.access_token;
            res.cookie("auth_token", accessToken, { httpOnly: true });
            res.cookie("refresh_token", tokenData.refresh_token, { httpOnly: true });

            // Retry user fetch with new access token
            userRes = await fetch("https://discord.com/api/users/@me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!userRes.ok) throw new Error("User fetch failed after refresh");
        }

        const user = await userRes.json();
        return res.json({ authenticated: true, user });
    } catch (err) {
        console.error("Validation error:", err);
        res.status(401).json({ authenticated: false });
    }
}

export function logout(req: Request, res: Response) {
    res.clearCookie("auth_token");
    res.clearCookie("refresh_token");
    console.log("Clearing cookies and redirecting to frontend");
    res.redirect(FRONTEND_URL);
}