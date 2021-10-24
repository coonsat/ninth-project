const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const { User } = require('../models/index');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// Get all users
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    // const user = req.currentUser;
    // res.json({
    //     name: user.name,
    //     username: user.username
    // });
    console.log('Request received')
    res.status(200);
}));

router.post('/', authenticateUser, asyncHandler(async (req, res) => {
    console.log(req);
    res.status(201);
}));

module.exports = router;