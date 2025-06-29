import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import querystring from "querystring";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.API_PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const FRONTEND_URL = "http://localhost:5173";

app.get("/", (_req, res) => {
  res.send("Hello from Express!");
});

// Start Discord OAuth2
app.get("/auth/discord", (req, res) => {
  try {
    const state = randomUUID();

    // Set the state cookie for CSRF protection
    res.cookie("oauth_state", state, {
      httpOnly: true,
      sameSite: "lax", // safer cookie handling
      secure: Bun.env.NODE_ENV === "production", // only send over HTTPS in production
    });

    const params = querystring.stringify({
      client_id: Bun.env.APP_ID,
      grant_type: "authorization_code",
      redirect_uri: Bun.env.DISCORD_REDIRECT_URI,
      response_type: "code",
      scope: "identify email",
      state,
    });

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?${params}`;

    return res.redirect(discordAuthUrl);
  } catch (err) {
    console.error("Error generating Discord OAuth2 URL:", err);
    return res.status(500).send("Failed to initiate authentication.");
  }
});

// Discord callback
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  if (!code || !state) {
    return res.status(400).send("Invalid OAuth state.");
  }

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: querystring.stringify({
        client_id: Bun.env.APP_ID,
        client_secret: Bun.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: Bun.env.DISCORD_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();

    console.log("Token data:", tokenData);

    if (!tokenData.access_token) {
      throw new Error("No access token received.");
    }

    // Store tokens in secure cookies
    res.cookie("auth_token", tokenData.access_token, {
      httpOnly: true,
      sameSite: "lax",
    });
    res.cookie("refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.redirect(FRONTEND_URL);
  } catch (err) {
    console.error("Authorization error:", err);
    res.status(500).send("Failed to authorize.");
  }
});

// Validate access token
app.get("/auth/validate", async (req, res) => {
  let accessToken = req.cookies.auth_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken) {
    return res
      .status(401)
      .json({ authenticated: false, message: "Not authenticated." });
  }

  try {
    // Step 1: Try to fetch the user with the current access token
    let userRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Step 2: If access token is invalid or expired, try to refresh
    if (userRes.status === 401 && refreshToken) {
      const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: querystring.stringify({
          client_id: process.env.APP_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          redirect_uri: process.env.DISCORD_REDIRECT_URI,
        }),
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error("Token refresh failed.");
      }

      // Update cookies with new tokens
      accessToken = tokenData.access_token;
      res.cookie("auth_token", accessToken, { httpOnly: true });
      res.cookie("refresh_token", tokenData.refresh_token, { httpOnly: true });

      // Retry user fetch with new access token
      userRes = await fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userRes.ok) throw new Error("User fetch failed after refresh");
    }

    const user = await userRes.json();
    return res.json({ authenticated: true, user });
  } catch (err) {
    console.error("Validation error:", err);
    res.status(401).json({ authenticated: false });
  }
});

// Logout
app.get("/logout", (_, res) => {
  res.clearCookie("auth_token");
  res.clearCookie("refresh_token");
  res.redirect(FRONTEND_URL);
});

// Token debug
app.get("/dashboard", (req, res) => {
  const accessToken = req.cookies.auth_token;
  const refreshToken = req.cookies.refresh_token;

  res.json({ accessToken, refreshToken });
});

app.listen(port, () => {
  console.log(`🚀 Express server running at http://localhost:${port}`);
});
