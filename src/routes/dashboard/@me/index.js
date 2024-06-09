const express = require("express");
const { hasPermission } = require("../../../lib/utils");
const router = express.Router();


  const DISCORD_ENDPOINT = "https://discord.com/api/v10";
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_SECRET;
  const REDIRECT_URI = "http://localhost:3001/auth/callback";

router.get("/", (req, res) => {
  if (req.user) {
    const { accessToken, refreshToken, ...userWithoutTokens } = req.user;
    res.status(200).json(userWithoutTokens);
  } else {
    res.status(401).json({ message: "You are not logged in." });
  }
});

router.get("/guilds", async (req, res) => {
  if (!req.user?.accessToken) {
    return res.status(401).json({ message: "You are not logged in." });
  }
  const guildsRes = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
      
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
  });
  
  if (!guildsRes.ok) {
    return res.status(guildsRes.status).json({ error: guildsRes.statusText });
  }

  const guilds = await guildsRes.json();

  const filteredGuilds = guilds.filter((guild) => hasPermission(guild.permissions, "ManageGuild"));

  res.status(200).json(filteredGuilds);

});

module.exports = router;
