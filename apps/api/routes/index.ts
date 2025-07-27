import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import serverRoutes from "./server";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/server", serverRoutes);

export default router;