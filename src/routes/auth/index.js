const express = require("express");
require("dotenv").config();
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// GET: api.cloxbot.me/auth/signin
// GET: api.cloxbot.me/auth/callback

router.get("/signin", (req, res) => {
  res.redirect(
    `https://discord.com/oauth2/authorize?client_id=654097136375431238&response_type=code&redirect_uri=${encodeURIComponent(
      "http://localhost:3001/auth/callback"
    )}&scope=identify+guilds+email`
  );
});

router.get("/callback", async (req, res) => {
  const DISCORD_ENDPOINT = "https://discord.com/api/v10";
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_SECRET;
  const REDIRECT_URI = "http://localhost:3001/auth/callback";
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "A 'code' query parameter must be in the URL!" });
  }

  try {
    const oauthRes = await fetch(`${DISCORD_ENDPOINT}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      }).toString(),
    });

    if (!oauthRes.ok) {
      const errorText = await oauthRes.text();
      console.error("OAuth token request failed", oauthRes.statusText, errorText);
      return res.status(oauthRes.status).json({ error: oauthRes.statusText, details: errorText });
    }

    const oauthJson = await oauthRes.json();

    const userRes = await fetch(`${DISCORD_ENDPOINT}/users/@me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${oauthJson.access_token}`,
      },
    });

    if (!userRes.ok) {
      const errorText = await userRes.text();
      console.error("User information request failed", userRes.statusText, errorText);
      return res.status(userRes.status).json({ error: userRes.statusText, details: errorText });
    }

    const userJson = await userRes.json();

    let user = await User.findOne({ id: userJson.id });

    if (!user) {
      user = new User({
        id: userJson.id,
        username: userJson.username,
        global_name: userJson.global_name,
        email: userJson.email,
        avatarHash: userJson.avatar,
        accessToken: oauthJson.access_token,
        refreshToken: oauthJson.refresh_token,
      });
    } else {
      user.username = userJson.username;
      user.global_name = userJson.global_name;
      user.email = userJson.email;
      user.avatarHash = userJson.avatar;
      user.accessToken = oauthJson.access_token;
      user.refreshToken = oauthJson.refresh_token;
    }

    await user.save();
    console.log(userJson);

    const token = jwt.sign(
      {
        id: userJson.id,
        username: userJson.username,
        global_name: userJson.global_name,
        email: userJson.email,
        avatarHash: userJson.avatar,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log(token);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        domain: "localhost",
        secure: process.env.NODE_ENV === "development",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .redirect("http://localhost:5173/");
  } catch (error) {
    console.error("Error in /callback route", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
