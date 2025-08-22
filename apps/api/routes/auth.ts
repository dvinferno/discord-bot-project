import { Router } from "express";
import {
  startDiscordAuth,
  handleDiscordCallback,
  validateAccessToken,
  logout,
} from "../controllers/authController";

// Create a new router instance for authentication routes.
const router = Router();

// Define authentication-related routes.

// Route to initiate the Discord OAuth2 authentication flow.
// When a GET request is made to /api/auth/discord, the startDiscordAuth controller function is executed.
// The `as any` cast is used here to bypass potential type mismatches with Express route handlers,
// assuming the controller functions correctly handle req, res, and next.
router.get("/discord", startDiscordAuth as any); // Handles redirection to Discord for authorization.

// Route to handle the callback from Discord after successful authorization.
// Discord redirects the user back to this endpoint with an authorization code.
router.get("/callback", handleDiscordCallback as any); // Processes the authorization code and exchanges it for tokens.

// Route to validate the current access token.
// This can be used by the frontend to check if the user's session is still valid.
router.get("/validate", validateAccessToken as any); // Verifies the validity of the user's session/token.

// Route to handle user logout.
router.get("/logout", logout as any); // Invalidates the user's session and clears authentication-related data.

export default router;