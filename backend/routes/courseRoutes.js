const express = require('express');
const { getAllCourses, getInstructorCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public or generic authenticated route to get all courses
router.get('/', protect, getAllCourses);

// Instructor only routes
// It might conflict with '/' above depending on structure, using a different path for instructor specifically
router.get('/instructor-courses', protect, authorize('instructor'), getInstructorCourses);
router.post('/', protect, authorize('instructor'), createCourse);
router.put('/:id', protect, authorize('instructor'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
