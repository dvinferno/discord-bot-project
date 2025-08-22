import type { Request, Response, NextFunction } from "express";

/**
 * Middleware to protect routes by checking for a valid Discord access token.
 * It expects the access token to be present in a cookie named `auth_token`.
 * If the token is missing or invalid, it sends an unauthorized response.
 * If valid, it fetches the user's Discord profile and attaches it to the request object.
 *
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The Express next middleware function.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    // Retrieve the access token from the cookies.
    const accessToken = req.cookies.auth_token;

    // If no access token is found, return an unauthorized response.
    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized: No access token found." });
    }

    try {
        // Verify the access token by attempting to fetch the user's own Discord profile.
        // This acts as a validation step for the token's authenticity and expiry.
        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // If the Discord API call was not successful (e.g., 401 Unauthorized), the token is invalid.
        if (!userRes.ok) {
            return res.status(401).json({ error: "Unauthorized: Invalid or expired access token." });
        }

        // Parse the user data from the successful response.
        const user = await userRes.json();
        (req as any).user = user; // Attach the fetched user object to the request for subsequent middleware/handlers.

        next(); // Proceed to the next middleware or route handler.
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(500).json({ error: "Internal server error during auth check." });
    }
}