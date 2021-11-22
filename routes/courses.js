const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const { Users, Courses } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// Get all courses with associated user.
router.get('/', asyncHandler(async (req, res) => {
    try {
        const courses = await Courses.findAll({
            attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
            include: [{
                    model: Users,
                    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
            }]
        });
        res.status(200).json(courses);
    } catch (error) {
        res.status(404).json('Access denied');
    }
}));

// Find the course by parameter and find the associated user
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Courses.findByPk(courseId, {
            attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
            include: [{
                model: Users, 
                attributes: ['id', 'firstName', 'lastName', 'emailAddress']
                }]
            });
        res.status(200).json(course);
    } catch (error) {
        if (
            error.name === 'SequelizeValidationError' ||
            error.name === 'SequelizeUniqueConstraintError'
        ) {
            const errors = error.errors.map((err) => err.message);
            res.status(400).json(errors);
        } else {
            throw error;
            res.status(404).json(error);
        }
    }
}));

// Create course. Send error message if validation triggered
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
        res.status(201).location(`/courses/${Course.id}`).json();
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

// Update a course
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Courses.findByPk(courseId);
        
        // Ensure that current user is updating his/her own course
        const currentUser = req.currentUser.dataValues.id;
        if (course) {
            if (course.userId === currentUser) {
                await course.update(req.body);
                res.status(204).location(`/courses/${course.id}`).json();
            } else {
                res.status(403).json({ message: 'You are not authorised to update this course' });
            }
        } else {
            res.status(404).json({ message: 'The course does not exist' });
        }

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
        const course = await Courses.findByPk(courseId, {
            include: [{
                model: Users,
                attributes: ['id'] 
            }]
        });
        
        // Ensure that current user is deleting his/her own course
        const currentUser = req.currentUser.dataValues.id;
        if (course.userId === currentUser) {
            course.destroy(course);
            res.status(204).json();
        } else {
            res.status(403).json({ message: 'You are not authorised to delete this course' });
        }
    } catch (error) {
        throw error;
    }
}));


module.exports = router; 