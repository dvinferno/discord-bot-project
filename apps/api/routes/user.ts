import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { getUserGuildsHandler } from "../controllers/userController";
import { getMutualGuildsHandler } from "../controllers/userController";

// Create a new router instance for user-related routes.
const router = Router();

// Define user-related routes.

// Route to get a list of guilds the authenticated user is a member of.
// This endpoint requires authentication to ensure only the logged-in user's guilds are returned.
// When a GET request is made to /api/user/guilds, the `requireAuth` middleware is executed first
// to verify the user's authentication status, followed by the `getUserGuildsHandler` controller.
// The `as any` casts are used to bypass potential type mismatches with Express route handlers,
// assuming the middleware and controller functions correctly handle req, res, and next.
router.get("/guilds", requireAuth as any, getUserGuildsHandler as any);

// Route to get a list of guilds that both the authenticated user and the bot are members of,
// and where the user has permission to manage the guild.
// This endpoint also requires authentication.
// When a GET request is made to /api/user/mutual-guilds, the `requireAuth` middleware is executed,
// followed by the `getMutualGuildsHandler` controller.
// This is useful for displaying a list of servers where the user can configure the bot.
router.get("/mutual-guilds", requireAuth as any, getMutualGuildsHandler as any);

// Export the router to be used by the main application.
export default router;