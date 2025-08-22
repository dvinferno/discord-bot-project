// Define the interface for the user object to ensure type safety and clarity.
interface DiscordUser {
    avatar: string | null; // The user's avatar hash, or null if they don't have a custom one.
    discriminator: string; // The user's 4-digit discriminator (e.g., "0001").
    id: string; // The user's unique Discord ID.
}

/**
 * Generates the URL for a Discord user's avatar.
 * If the user has a custom avatar, it returns the URL to that avatar.
 * Otherwise, it returns the URL to their default Discord avatar based on their discriminator.
 *
 * @param user - An object containing the user's avatar hash, discriminator, and ID.
 * @returns The URL string for the user's Discord avatar.
 */
const getDiscordAvatar = (user: DiscordUser): string => {
    // Check if the user has a custom avatar.
    if (user.avatar) {
        // If a custom avatar exists, construct the URL using the user's ID and avatar hash.
        // The `?size=512` parameter requests a 512x512 pixel version of the avatar.
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`;
    } else {
        // If no custom avatar, calculate the default avatar index based on the discriminator.
        // Discord uses 5 default avatars (0-4) for users without custom avatars.
        const defaultAvatarIndex = parseInt(user.discriminator) % 5;
        return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
    }
};

export default getDiscordAvatar;