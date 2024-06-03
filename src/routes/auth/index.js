const express = require("express");
require("dotenv").config();
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// GET: api.cloxbot.me/auth/signin
// GETl api.cloxbot.me/auth/callback

router.get("/signin", (req, res) => {
  res.redirect(
    `https://discord.com/oauth2/authorize?client_id=654097136375431238&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fcallback&scope=identify+guilds+email`
  );
});

router.get("/callback", async (req, res) => {
  const DISCORD_ENDPOINT = "https://discord.com/api/v10";
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_SECRET;
  const REDIRECT_URI = "http://localhost:3001/auth/callback";
  const { code } = req.query;

  if (!code) return res.status(400).json({ error: "A 'code' query parameter must be in the url !" });

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
  if (!oauthRes) {
    console("error", oauthRes);
    res.send("error");
  }
  const aouthJson = await oauthRes.json();

  const userRes = await fetch(`${DISCORD_ENDPOINT}/users/@me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${aouthJson.access_token}`,
    },
  });
  if (!userRes) {
    console("error", userRes);
    res.send("error");
  }

  const userJson = await userRes.json();

 
  let user = await User.findOne({ id: userJson.id });

  if (!user) {
    user = new User({
      id: userJson.id,
      username: userJson.username,
      email: userJson.email,
      avatarHash: userJson.avatar,
      accessToken: aouthJson.access_token,
      refreshToken: aouthJson.refresh_token,
    });
  } else {
    user.username = userJson.username;
    user.email = userJson.email;
    user.avatarHash = userJson.avatar;
    user.accessToken = aouthJson.access_token;
    user.refreshToken = aouthJson.refresh_token;
  }
  await user.save();

  const token = jwt.sign(
    {
      id: userJson.id,
      username: userJson.username,
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
      //sameSite: "none",
    })
    .json({ success: true });
  
});
module.exports = router;

