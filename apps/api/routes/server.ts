import { Router } from "express";
import { getBotGuildsHandler } from "../controllers/serverController";

const router = Router();

router.get("/guilds", getBotGuildsHandler); // GET /api/server

export default router;