import type { Request, Response } from "express";
import { getBotGuilds } from "../utils/discordService";

/**
 * Handles the request to get a list of guilds the bot is a member of.
 * This controller fetches the bot's guilds and sends them as a JSON response.
 *
 * @param _ The Express request object (unused in this handler).
 * @param res The Express response object.
 * @returns A JSON response containing the list of bot guilds or an error message.
 */
export async function getBotGuildsHandler(_: Request, res: Response) {
  try {
    // Fetch the guilds the bot is currently in.
    const guilds = await getBotGuilds();

    // Send the fetched guilds as a JSON response with a 200 OK status.
    res.json(guilds);
  } catch (err) {
    // Log the error for debugging purposes.
    console.error("Error fetching bot guilds:", err);
    // Send a 500 Internal Server Error response if fetching guilds fails.
    res.status(500).json({ error: "Failed to fetch bot guilds" });
  }
}