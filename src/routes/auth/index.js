const express = require("express");
require("dotenv").config();
const User = require("../../models/user");

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
        console('error', oauthRes);
        res.send("error")
    }
    const aouthJson = await oauthRes.json();

    const userRes = await fetch(`${DISCORD_ENDPOINT}/users/@me`, {
       method: "GET",
       headers: {
           "Content-Type": "application/x-www-form-urlencoded",
           "Authorization": `Bearer ${aouthJson.access_token}`,
       },
 
     });
    if (!userRes) {
        console('error', userRes);
        res.send("error")
    }

    const userJson = await userRes.json();
    
    const userExists = await User.exists({ id: userJson.id })
    
    if (userExists) {
        res.send("User already exists")
        return;
    } 

    const newUser = new User({
        id: userJson.id,
        username: userJson.username,
        email: userJson.email,
        avatarHash: userJson.avatar,
        accessToken: aouthJson.access_token,
        refreshToken: aouthJson.refresh_token,

        
    });

    await newUser.save();
    res.send("sucess");


});


   

module.exports = router;
