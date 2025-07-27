const getDiscordAvatar = (user: {
    avatar: string | null;
    discriminator: string;
    id: string;
}) => {
    if (!user.avatar) {
        const defaultAvatarIndex = parseInt(user.discriminator) % 5;
        return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
    }
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`;
};

export default getDiscordAvatar;