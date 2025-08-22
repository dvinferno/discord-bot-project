import type { Request, Response } from "express";
import { getUserGuilds, getMutualManageableGuilds } from "../utils/discordService";

/**
 * Handles the request to get a list of guilds the authenticated user is a member of.
 * This controller fetches the user's guilds from Discord and optionally filters them
 * to include only those where the user has 'MANAGE_GUILD' permissions.
 *
 * @param req The Express request object, expected to contain `auth_token` in cookies.
 * @param res The Express response object.
 * @returns A JSON response containing the list of user guilds or an error message.
 */
export async function getUserGuildsHandler(req: Request, res: Response) {
  // Retrieve the access token from the request cookies.
  const accessToken = req.cookies.auth_token;

  // If no access token is found, the user is not authenticated.
  if (!accessToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    // Fetch all guilds the user is a member of using their access token.
    const guilds = await getUserGuilds(accessToken);

    // Define the 'MANAGE_GUILD' permission bit.
    // This is a Discord API permission bitmask (0x20 in hexadecimal, which is 32 in decimal).
    const MANAGE_GUILD_PERMISSION = 0x20n;

    // Filter the fetched guilds to include only those where the user has the 'MANAGE_GUILD' permission.
    // The `permissions` field from Discord API is a string representation of a snowflake (large integer),
    // so it's converted to a BigInt for bitwise operations.
    const manageableGuilds = guilds.filter(guild => {
      const perms = BigInt(guild.permissions);
      // Check if the MANAGE_GUILD_PERMISSION bit is set in the user's permissions.
      return (perms & MANAGE_GUILD_PERMISSION) === MANAGE_GUILD_PERMISSION;
    });

    // Send the filtered list of manageable guilds as a JSON response with a 200 OK status.
    res.json(manageableGuilds);
  } catch (err) {
    // Log the error for debugging purposes.
    console.error("Error fetching user guilds:", err);
    // Send a 500 Internal Server Error response if fetching guilds fails.
    res.status(500).json({ error: "Failed to fetch user guilds" });
  }
}

/**
 * Handles the request to get a list of guilds that both the authenticated user
 * and the bot are members of, and where the user has permission to manage the guild.
 * This is useful for displaying a list of servers where the user can configure the bot.
 *
 * @param req The Express request object, expected to contain `auth_token` in cookies.
 * @param res The Express response object.
 * @returns A JSON response containing the list of mutual manageable guilds or an error message.
 */
export async function getMutualGuildsHandler(req: Request, res: Response) {
  // Retrieve the access token from the request cookies.
  const accessToken = req.cookies.auth_token;

  // If no access token is found, the user is not authenticated.
  if (!accessToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    // Fetch guilds that are mutual between the user and the bot, and are manageable by the user.
    const mutualGuilds = await getMutualManageableGuilds(accessToken);

    // Send the list of mutual manageable guilds as a JSON response with a 200 OK status.
    res.json(mutualGuilds);
  } catch (err) {
    // Log the error for debugging purposes.
    console.error("Error fetching mutual guilds:", err);
    // Send a 500 Internal Server Error response if fetching mutual guilds fails.
    res.status(500).json({ error: "Failed to fetch mutual guilds" });
  }
}