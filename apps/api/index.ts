import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes";

const app = express();
const port = Bun.env.API_PORT || 3001;
const FRONTEND_URL = Bun.env.FRONTEND_URL || "http://localhost:5173";

// ───── Middleware ─────
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ───── Root Route ─────
app.get("/", (_req, res) => {
  res.send("Hello from Express!");
});

// ───── API Routes ─────
app.use("/api", apiRoutes);

// ───── Start Server ─────
app.listen(port, () => {
  console.log(`🚀 API running at http://localhost:${port}`);
});