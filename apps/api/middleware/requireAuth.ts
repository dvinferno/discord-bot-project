import type { Request, Response, NextFunction } from "express";

// Protect routes by checking for a valid access token cookie
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.auth_token;

    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized: No access token found." });
    }

    try {
        // Optional: Verify the token is valid by fetching Discord user
        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!userRes.ok) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await userRes.json();
        (req as any).user = user; // Attach user to request object for later use

        next(); // All good, continue
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(500).json({ error: "Internal server error during auth check." });
    }
}