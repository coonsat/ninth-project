const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// Get all courses with associated user.
router.get('/', authenticateUser, asyncHandler(async (req,res) => {
    try {
        const courses = Course.findAll({
            attributes: [
                'id', 'title', 'description', 'estimatedTime', 'materialsNeeded'
            ],
            include: [
                {
                    model: Users,
                    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
                }
            ]
        });
        res.status(201).json(courses);
    } catch (error) {
        res.status(404).json('Access denied');
    }
}));

module.exports = router; 