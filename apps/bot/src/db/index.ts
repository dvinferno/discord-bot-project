import { MongoClient } from "mongodb";
import { initializeGuildsCollection } from "./initGuilds";

const uri = Bun.env.DATABASE_URI; // or your connection string
const client = new MongoClient(uri!);

export const db = client.db(Bun.env.DATABASE_NAME);

export async function initializeDatabase() {
    console.log("🔧 Initializing MongoDB database...");

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        await ensureCollectionsExist();
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
    }

    async function ensureCollectionsExist() {
        const existingCollections = await db.listCollections().toArray();
        const collectionNames = existingCollections.map((col) => col.name);

        if (!collectionNames.includes("guilds")) {
            await db.createCollection("guilds");
            console.log("✅ Guilds collection created");
        } else {
            console.log("✅ Guilds collection already exists");
        }
        console.log("🔧 Database initialization complete");
    }

    await initializeGuildsCollection();

}