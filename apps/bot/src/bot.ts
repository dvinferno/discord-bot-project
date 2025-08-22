import {
    Client,
    GatewayIntentBits,
} from "discord.js";

import { initializeDatabase } from "./db/index";
import { ensureGuildExists, updateGuildStats } from "./utils/addGuild"; // Import the function to ensure guild exists

// Initialize Discord Client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Required for guild-related events like guild creation, updates, and deletion.
        // Add other intents as needed for your bot's functionality, e.g.:
        // GatewayIntentBits.GuildMessages, // For receiving messages in guilds
        // GatewayIntentBits.DirectMessages, // For receiving direct messages
        // GatewayIntentBits.MessageContent, // **PRIVILEGED INTENT**: Required to read message content
    ],
});

// Event listener for when the bot successfully logs in and becomes ready
client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}`);

    for (const guild of client.guilds.cache.values()) {
        await ensureGuildExists(guild);
        await updateGuildStats(guild);

        setInterval(() => updateGuildStats(guild), 10 * 60 * 1000);
    }

    // You can add more initialization logic here, e.g.,
    // - Registering slash commands
    // - Setting bot's presence/activity
    // - Loading cached data
});

client.on("guildCreate", async (guild) => {
    await ensureGuildExists(guild);
});


// Connect to the database before logging into Discord
// This ensures that database operations are ready when the bot starts
await initializeDatabase();
await client.login(Bun.env.DISCORD_TOKEN);