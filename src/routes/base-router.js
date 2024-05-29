const express = require('express');
const ticketsRouter = require('./tickets');
const authRouter = require('./auth');

const router = express.Router();

router.use('/tickets', ticketsRouter);
router.use('/auth', authRouter);

module.exports = router;