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

    // Required indexes (extendable list)
    const requiredIndexes: { key: { [key: string]: 1 | -1 }, options: { name: string; unique?: boolean } }[] = [
        {
            key: { guildId: 1 },
            options: { unique: true, name: "guildId_unique" },
        },
        {
            key: { "modules.welcome": 1 },
            options: { name: "modules_welcome" },
        },
        {
            key: { createdAt: 1 },
            options: { name: "createdAt_index" },
        },
    ];

    // Fetch current index names
    const existingIndexes = await guilds.indexes();
    const existingIndexNames = new Set(existingIndexes.map(i => i.name));

    for (const { key, options } of requiredIndexes) {
        if (!existingIndexNames.has(options.name)) {
            await guilds.createIndex(key, options);
            console.log(`➕ Created index: ${options.name}`);
        } else {
            console.log(`✔ Index already exists: ${options.name}`);
        }
    }

    console.log("✅ Guilds collection initialized with required indexes.");
}