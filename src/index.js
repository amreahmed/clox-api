const express = require('express');
const mongoose = require('mongoose');
const baseRouter = require('./routes/base-router');
require('dotenv').config();


const app = express();
const PORT = 3001;

app.use('/', baseRouter);

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env file");
}
    
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to Database.");
   app.listen(PORT, () => {
     console.log("listening on port", PORT);
   });
});
 








