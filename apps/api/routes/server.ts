import { Router } from "express";
import { getBotGuildsHandler } from "../controllers/serverController";

// Create a new router instance for server-related routes.
const router = Router();

// Define server-related routes.

// Route to get a list of guilds the bot is a member of.
// This endpoint is typically used to display which servers the bot is active in.
// When a GET request is made to /api/server/guilds, the `getBotGuildsHandler`
// controller function is executed.
// No authentication middleware is applied here, as this information might be public
// or used for internal monitoring.
router.get("/guilds", getBotGuildsHandler);

// Export the router to be used by the main application.
export default router;