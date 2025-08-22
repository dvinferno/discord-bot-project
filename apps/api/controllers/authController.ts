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

// Frontend URL where the user will be redirected after authentication.
// This should ideally be configurable via environment variables.
// eslint-disable-next-line bun/no-process-env
const FRONTEND_URL = Bun.env.FRONTEND_URL || "http://localhost:5173";

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

/**
 * Handles the callback from Discord after the user authorizes the application.
 * Exchanges the authorization code for access and refresh tokens,
 * sets them as secure cookies, and redirects to the frontend.
 *
 * @param req The Express request object, containing query parameters (code, state) and cookies.
 * @param res The Express response object.
 * @returns A redirect response to the frontend or an error response.
 */
export async function handleDiscordCallback(req: Request, res: Response) {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const storedState = req.cookies.oauth_state; // Retrieve the state stored in the cookie.

    // Validate the authorization code and the state parameter for CSRF protection.
    if (!code || !state || state !== storedState) {
        return res.status(400).send("Invalid OAuth state or missing code.");
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
            // eslint-disable-next-line bun/no-process-env
            const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: querystring.stringify({
                    client_id: Bun.env.APP_ID,
                    client_secret: Bun.env.CLIENT_SECRET,
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                    redirect_uri: Bun.env.DISCORD_REDIRECT_URI,
                }),
            });

            // Parse the response from the token refresh endpoint.
            const responseData = await tokenRes.json();

            // If refresh failed, log the error and throw.
            if (!tokenRes.ok) {
                const errorData = responseData as OAuth2TokenError; // Cast to our error type.
                console.error("Error from Discord token endpoint:", errorData);
                throw new Error(
                    `Discord API error: ${errorData.error_description || errorData.error
                    }`,
                );
            }

            // Cast the successful refresh response to the expected token result type.
            const tokenData = responseData as RESTPostOAuth2AccessTokenResult;

            // If access token is still not present after refresh, something went wrong.
            if (!tokenRes.ok || !tokenData.access_token) {
                throw new Error("Token refresh failed.");
            }

            // Update cookies with the newly obtained access and refresh tokens.
            // Ensure secure and httpOnly flags are consistent.
            const cookieOptions = { httpOnly: true, sameSite: "lax", secure: Bun.env.NODE_ENV === "production" } as const;

            accessToken = tokenData.access_token;
            res.cookie("auth_token", accessToken, cookieOptions);
            res.cookie("refresh_token", tokenData.refresh_token, cookieOptions);

            // Retry user fetch with new access token
            // Retry user fetch with new access token
            userRes = await fetch("https://discord.com/api/users/@me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!userRes.ok) {
                throw new Error("User fetch failed after refresh");
            }
        } else if (!userRes.ok) {
            // If the initial user fetch failed for reasons other than 401, or if 401
            // occurred without a refresh token, then the user is not authenticated.
            return res.status(401).json({ authenticated: false, message: "Invalid or expired token." });
        }

        // If everything is successful, parse the user data and return authenticated status.
        const user = await userRes.json();
        return res.json({ authenticated: true, user });
    } catch (err) {
        console.error("Validation error:", err);
        // On any error during validation or refresh, consider the user unauthenticated.
        res.status(401).json({ authenticated: false, message: "Authentication validation failed." });
    }
}

/**
 * Handles user logout by clearing authentication-related cookies
 * and redirecting the user to the frontend.
 *
 * @param req The Express request object.
 * @param res The Express response object.
 */
export function logout(req: Request, res: Response) {
    res.clearCookie("auth_token");
    res.clearCookie("refresh_token");
    console.log("Clearing cookies and redirecting to frontend");
    res.redirect(FRONTEND_URL);
}