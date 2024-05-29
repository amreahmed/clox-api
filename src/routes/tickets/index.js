const express = require("express");

const router = express.Router();

// GET: api.cloxbot.me/tickets


router.get("/guild/:id", (req, res) => { 
    const { id } = req.params;
    res.send(`Getting tickets for guild id: ${id}`);
   
});

router.post("/", (req, res) => {
    res.send("POST /tickets route working");
})


module.exports = router;