const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    res.json({success: true, message: 'Recivied request successfully'})
});


if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env file");
}
    
 mongoose.connect(process.env.MONGODB_URI).then(() => {
   console.log("Connected to MongoDB");

   app.listen(PORT, () => {
     console.log("listening on port", PORT);
   });
 });

 