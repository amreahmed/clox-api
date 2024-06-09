const express = require('express');
const ticketsRouter = require('./tickets');
const authRouter = require('./auth');
const dashboardRouter = require('./dashboard');

const router = express.Router();

router.use('/tickets', ticketsRouter);
router.use('/auth', authRouter);
router.use("/dashboard", dashboardRouter);


module.exports = router;