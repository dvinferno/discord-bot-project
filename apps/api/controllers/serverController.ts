import type { Request, Response } from "express";
import { getBotGuilds } from "../utils/discordService";

export async function getBotGuildsHandler(_: Request, res: Response) {
  try {
    const guilds = await getBotGuilds();
    res.json(guilds);
  } catch (err) {
    console.error("Error fetching bot guilds:", err);
    res.status(500).json({ error: "Failed to fetch bot guilds" });
  }
}