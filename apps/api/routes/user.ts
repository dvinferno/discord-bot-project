import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { getUserGuildsHandler } from "../controllers/userController";
import { getMutualGuildsHandler } from "../controllers/userController";

const router = Router();

router.get("/guilds", requireAuth as any, getUserGuildsHandler as any);
router.get("/mutual-guilds", requireAuth as any, getMutualGuildsHandler as any);

export default router;