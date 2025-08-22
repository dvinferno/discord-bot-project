import { Guild } from "discord.js";
import { guilds } from "../db/index"; // Import the 'guilds' collection from the database

/**
 * Ensures that a guild exists in the database. If it doesn't, a new entry is created.
 * @param guild The Discord Guild object.
 */
export async function ensureGuildExists(guild: Guild) {
    const existing = await guilds.findOne({ guildId: guild.id });

    if (!existing) {
        await guilds.insertOne({
            guildId: guild.id,
            name: guild.name,
            createdAt: new Date(),
            modules: {}, // Placeholder for future module configurations
            logs: [
                { action: "Bot joined guild", timestamp: new Date() } // Log when the bot joins
            ],
            stats: {
                memberCount: guild.memberCount,
                lastUpdated: new Date()
            }
        });
        console.log(`✅ Added new guild to DB: ${guild.name} (${guild.id})`);
    }
}

/**
 * Updates the statistics for a guild in the database.
 * This includes member count, bot count, and the last updated timestamp.
 *
 * Note: To get the bot count, the `GatewayIntentBits.GuildMembers` intent is required.
 * However, this utility function does not have direct access to the client's intents.
 * It relies on the `guild.members.cache` which might not be fully populated without the intent.
 * For accurate bot count, ensure the bot client has `GatewayIntentBits.GuildMembers` intent enabled.
 * @param guild The Discord Guild object.
 */
export async function updateGuildStats(guild: Guild) {
    try {

        const memberCount = guild.memberCount;
        const botCount = guild.members.cache.filter(m => m.user.bot).size;
        const onlineCount = guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size;

        await guilds.updateOne(
            { guildId: guild.id },
            {
                $set: {
                    name: guild.name,
                    "stats.memberCount": memberCount,
                    "stats.botCount": botCount,
                    "stats.lastUpdated": new Date(),
                    "stats.onlineCount": onlineCount,
                    "stats.roleCount": guild.roles.cache.size,
                    "stats.channelCount": guild.channels.cache.size,
                },
            },
            { upsert: true }
        ); // Update the guild document with new stats
        console.log(`✅ Updated stats for ${guild.name}: ${memberCount} members, ${botCount} bots`);
    } catch (error) {
        console.error(`Failed to update stats for guild ${guild.name} (${guild.id}):`, error);
        return;
    }
}