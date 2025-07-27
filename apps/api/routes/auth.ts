import { Router } from "express";
import {
    startDiscordAuth,
    handleDiscordCallback,
    validateAccessToken,
    logout,
} from "../controllers/authController";

const router = Router();

// Route to start Discord authentication
router.get("/discord", startDiscordAuth as any);
router.get("/callback", handleDiscordCallback as any);
router.get("/validate", validateAccessToken as any);
router.get("/logout", logout as any);

export default router;