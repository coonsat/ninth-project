const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const { Users, Courses } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// Get all courses with associated user.
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const courses = Courses.findAll({
            attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
            include: [{
                    model: Users,
                    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
            }]
        });

        res.status(200).json(courses);

    } catch (error) {
        console.log(error)
        res.status(404).json('Access denied');
    }
}));

// Find the course by parameter and find the associated user
router.get('/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = Course.findByPk(courseId, {
            attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
            include: [{
                model: User, 
                attributes: ['id', 'firstName', 'lastName', 'emailAddress']
                }]
            });
        res.json(200).json(course);
    } catch (error) {
        if (
            error.name === 'SequelizeValidationError' ||
            error.name === 'SequelizeUniqueConstraintError'
        ) {
            const errors = error.errors.map((err) => err.message);
            res.status(400).json({errors});
        } else {
            throw error;
            res.status(404).json(error);
        }
    }
}));

// Create course. Send error message if validation triggered
// 15.11.2021 -> no body is being received. 
router.post('/', authenticateUser, asyncHandler(async(req, res) => {

    try {
        const user = req.currentUser;

        const Course = await Courses.create({
            title: req.body.title,
            description: req.body.description,
            estimatedTime: req.body.estimatedTime,
            materialsNeeded: req.body.materialsNeeded,
            userId: user.id
        });
        res.status(201).location(`/courses/${course.id}`).json();
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

//Update a course
router.post('/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Courses.findByPk(courseId);
        course.update(req.body);
        res.status(204).json();

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

// Delete a course
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Courses.findByPk(courseId);
        course.destroy(course);
        res.status(204).json();

    } catch (error) {
        throw error;
    }
}));


module.exports = router; 