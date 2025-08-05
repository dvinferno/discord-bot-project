import {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
} from "discord.js";

import { initializeDatabase } from "./db/index";

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

await initializeDatabase(); // after login or before if you prefer
await client.login(Bun.env.DISCORD_TOKEN);