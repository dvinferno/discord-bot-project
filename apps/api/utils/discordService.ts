import { SimpleCache } from "../utils/cache";

const userGuildCache = new SimpleCache<string, any[]>(5 * 60 * 1000); // 5 min TTL
const botGuildCache = new SimpleCache<string, any[]>(5 * 60 * 1000);
const BOT_GUILDS_CACHE_KEY = "bot_guilds";

export async function getUserGuilds(accessToken: string) {
    const cached = userGuildCache.get(accessToken);
    if (cached) {
        return cached;
    }

    const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user guilds");
    }

    type userGuildCache = {
        id: string;
        name: string;
        icon: string | null;
        owner: boolean;
        permissions: string;
    }

    const guilds = await res.json();
    userGuildCache.set(accessToken, guilds as userGuildCache[]);
    return guilds as userGuildCache[];
}

export async function getBotGuilds(): Promise<{
    id: string;
    name: string;
    icon: string | null;
}[]> {
    const cached = botGuildCache.get(BOT_GUILDS_CACHE_KEY);
    if (cached) return cached;

    const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
        headers: {
            Authorization: `Bot ${Bun.env.DISCORD_TOKEN}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch bot guilds");
    }

    const guilds = await res.json() as any[];

    const trimmed = guilds.map((guild: any) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
    }));

    botGuildCache.set(BOT_GUILDS_CACHE_KEY, trimmed);
    return trimmed;
}

export async function getMutualManageableGuilds(accessToken: string) {
    const [userGuilds, botGuilds] = await Promise.all([
        getUserGuilds(accessToken),
        getBotGuilds(),
    ]);

    const botGuildIds = new Set(botGuilds.map(g => g.id));

    // Keep only guilds the user can manage and the bot is in
    const mutualGuilds = userGuilds
        .filter(userGuild => {
            const perms = BigInt(userGuild.permissions);
            const canManage = (perms & 0x20n) === 0x20n; // MANAGE_GUILD
            return canManage && botGuildIds.has(userGuild.id);
        })
        .map(userGuild => {
            const botGuild = botGuilds.find(g => g.id === userGuild.id);
            const iconUrl = botGuild?.icon
                ? `https://cdn.discordapp.com/icons/${botGuild.id}/${botGuild.icon}.png`
                : null;

            return {
                id: botGuild!.id,
                name: botGuild!.name,
                icon: iconUrl,
            };
        });

    return mutualGuilds;
}