const express = require('express');
const { enrollInCourse, getEnrolledCourses } = require('../controllers/enrollmentController');
const { getInstructorCourses } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Student routes
router.post('/enroll/:courseId', protect, authorize('student'), enrollInCourse);
router.get('/my-courses', protect, (req, res, next) => {
  // Route used by Student AND Instructor
  if (req.user.role === 'student') {
    return getEnrolledCourses(req, res, next);
  } else if (req.user.role === 'instructor') {
    return getInstructorCourses(req, res, next);
  } else {
    res.status(403).json({ message: 'Not authorized for this route' });
  }
});

module.exports = router;
