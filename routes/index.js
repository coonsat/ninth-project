const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const { Users } = require('../models/index');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// Get currently logged in user
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    const user = {
        id: req.currentUser.id,
        firstName: req.currentUser.firstName,
        lastName: req.currentUser.lastName,
        emailAddress: req.currentUser.emailAddress
    };
    res.status(200).json(user);
}));

// Create a user 
router.post('/', asyncHandler(async (req, res) => {
    try {
        await Users.create(req.body);
        res.status(201).location('/').json();
    } catch (error) {
        if ( 
             error.name === 'SequelizeValidationError' ||
             error.name === 'SequelizeUniqueConstraintError'
        ) {
            const errors = error.errors.map((err) => err.message);
            res.status(400).json({errors});
        } else {
            throw error;
        }
    }
}));

module.exports = router;