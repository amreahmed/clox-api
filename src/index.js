const express = require('express');
const mongoose = require('mongoose');
const baseRouter = require('./routes/base-router');
const baseMiddleware = require('./middlewares/base-middleware')
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = 3001;

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser())
app.use("/", baseMiddleware);
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
 











