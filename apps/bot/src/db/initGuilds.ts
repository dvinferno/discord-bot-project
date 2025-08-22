import { db } from "./index";

export async function initializeGuildsCollection() {
    const collectionName = "guilds";

    // Check if collection exists
    const existingCollections = await db.listCollections().toArray();
    const exists = existingCollections.some((c) => c.name === collectionName);

    if (!exists) {
        console.log(`🛠️ Creating '${collectionName}' collection...`);
        await db.createCollection(collectionName);
    }

    const guilds = db.collection(collectionName);
}