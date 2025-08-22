import { Router } from "express";
// Import individual route modules
import authRoutes from "./auth";
import userRoutes from "./user";
import serverRoutes from "./server";

// Create a new router instance to consolidate all API routes
const router = Router();

// Mount the imported route modules under specific paths.
// This organizes the API endpoints into logical groups.
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/server", serverRoutes);

export default router;