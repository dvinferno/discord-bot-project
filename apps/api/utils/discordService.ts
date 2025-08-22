import { SimpleCache } from "../utils/cache";

// Define cache instances with specific TTLs for different types of Discord data.
// User guilds are cached for 5 minutes to reduce repeated API calls for active users.
const userGuildCache = new SimpleCache<string, UserGuild[]>(5 * 60 * 1000); // 5 min TTL
// Bot guilds are cached for 1 minute as they are less likely to change frequently.
const botGuildCache = new SimpleCache<string, BotGuild[]>(1 * 60 * 1000);
// A constant key for caching bot guilds, as there's only one set of bot guilds.
const BOT_GUILDS_CACHE_KEY = "bot_guilds";

// Type definition for a user's guild object, as returned by Discord API.
type UserGuild = {
 id: string;
 name: string;
 icon: string | null;
 owner: boolean;
 permissions: string; // Permissions are a string, often a large integer.
};

/**
 * Fetches guilds the user is a member of from the Discord API.
 * Caches the result to prevent excessive API calls.
 *
 * @param accessToken The user's OAuth2 access token.
 * @returns A promise that resolves to an array of UserGuild objects.
 * @throws An error if the API call fails.
 */
export async function getUserGuilds(accessToken: string): Promise<UserGuild[]> {
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

    const guilds: UserGuild[] = await res.json();
    userGuildCache.set(accessToken, guilds);
    return guilds;
}

// Type definition for detailed guild information from Discord API.
type GuildDetails = {
    owner_id: string;
    approximate_member_count?: number;
    approximate_presence_count?: number;
    // Other properties can be added as needed, e.g., `id`, `name`, `icon`, etc.
    // For simplicity, we only define the ones used in `getMutualManageableGuilds`.
};

// Type definition for a bot's guild object, trimmed for necessary information.
type BotGuild = {
 id: string;
 name: string;
 icon: string | null;
};

/**
 * Fetches detailed information for a specific guild from the Discord API.
 * Requires the bot's token for authorization.
 *
 * @param id The ID of the guild to fetch details for.
 * @returns A promise that resolves to GuildDetails or null if fetching fails.
 */
async function getGuildDetails(id: string): Promise<GuildDetails | null> {
    const res = await fetch(`https://discord.com/api/v10/guilds/${id}?with_counts=true`, {
        headers: {
            Authorization: `Bot ${Bun.env.DISCORD_TOKEN}`,
        },
    });

    if (!res.ok) {
        const error = await res.text();
        console.error(`Failed to fetch guild ${id}:`, res.status, error);
        return null;
    }

    return res.json() as Promise<GuildDetails>; // includes owner_id, member counts, etc.
}

/**
 * Fetches guilds the bot is a member of from the Discord API.
 * Caches the result using a predefined key.
 *
 * @returns A promise that resolves to an array of BotGuild objects.
 * @throws An error if the API call fails.
 */
export async function getBotGuilds(): Promise<BotGuild[]> {
    const cached = botGuildCache.get(BOT_GUILDS_CACHE_KEY);
    if (cached) {
 return cached;
    }

    const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
        headers: {
            Authorization: `Bot ${Bun.env.DISCORD_TOKEN}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch bot guilds");
    }

    const guilds: BotGuild[] = await res.json();

    // Trim the guild objects to only include necessary information before caching.
    const trimmedGuilds = guilds.map((guild) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
    }));

    botGuildCache.set(BOT_GUILDS_CACHE_KEY, trimmedGuilds);
    return trimmedGuilds;
}

// Type definition for a mutual manageable guild, combining user and bot perspectives.
export type MutualGuild = {
 id: string;
 name: string;
 icon: string | null;
 ownerId: string | null;
 memberCount: number | null;
 presenceCount: number | null;
};

/**
 * Fetches guilds that both the user and the bot are in, and the user has permission to manage.
 * This function performs multiple Discord API calls concurrently and filters results.
 *
 * @param accessToken The user's OAuth2 access token.
 * @returns A promise that resolves to an array of MutualGuild objects.
 */
export async function getMutualManageableGuilds(accessToken: string): Promise<MutualGuild[]> {
    const [userGuilds, botGuilds] = await Promise.all([
        getUserGuilds(accessToken),
        getBotGuilds(),
    ]);

    const botGuildIds = new Set(botGuilds.map(g => g.id));

    // Filter user guilds to find those where:
    // 1. The user has the 'MANAGE_GUILD' permission (0x20n).
    // 2. The bot is also a member of the guild.
    const mutualGuilds = await Promise.all(userGuilds
        .filter(userGuild => {
            const perms = BigInt(userGuild.permissions);
            const MANAGE_GUILD_PERMISSION = 0x20n; // Discord permission bit for 'MANAGE_GUILD'
            const canManage = (perms & MANAGE_GUILD_PERMISSION) === MANAGE_GUILD_PERMISSION;
            return canManage && botGuildIds.has(userGuild.id);
        })
        .map(async userGuild => {
            // Find the corresponding bot guild to get its icon and name directly.
            const botGuild = botGuilds.find(g => g.id === userGuild.id);
            // Fetch detailed guild information, including owner ID and member counts.
            const details = await getGuildDetails(userGuild.id);

            // Construct the icon URL if an icon hash exists for the bot guild.
            const iconUrl = botGuild?.icon ?
                `https://cdn.discordapp.com/icons/${botGuild.id}/${botGuild.icon}.png` :
                null;

            // Return a structured object containing relevant information for the mutual guild.
            return {
                id: botGuild!.id, // Non-null assertion is safe because of the filter above.
                name: botGuild!.name, // Non-null assertion is safe.
                icon: iconUrl,
                ownerId: details?.owner_id ?? null, // Use nullish coalescing for optional properties.
                memberCount: details?.approximate_member_count ?? null, // Use nullish coalescing.
                presenceCount: details?.approximate_presence_count ?? null, // Use nullish coalescing.
            };
        }));

    return mutualGuilds;
}