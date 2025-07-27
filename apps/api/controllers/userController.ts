import type { Request, Response } from "express";
import { getUserGuilds } from "../utils/discordService";
import { getMutualManageableGuilds } from "../utils/discordService";

export async function getUserGuildsHandler(req: Request, res: Response) {
    const accessToken = req.cookies.auth_token;

    if (!accessToken) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const guilds = await getUserGuilds(accessToken);

        // Optional: Filter to only those the user can manage
        const manageableGuilds = guilds.filter(guild => {
            const perms = BigInt(guild.permissions);
            return (perms & 0x20n) === 0x20n; // MANAGE_GUILD bit
        });

        res.json(manageableGuilds);
    } catch (err) {
        console.error("Error fetching user guilds:", err);
        res.status(500).json({ error: "Failed to fetch user guilds" });
    }
}

export async function getMutualGuildsHandler(req: Request, res: Response) {
    const accessToken = req.cookies.auth_token;
    if (!accessToken) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const mutualGuilds = await getMutualManageableGuilds(accessToken);
        res.json(mutualGuilds);
    } catch (err) {
        console.error("Error fetching mutual guilds:", err);
        res.status(500).json({ error: "Failed to fetch mutual guilds" });
    }
}