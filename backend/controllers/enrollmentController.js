const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      studentId: req.user._id,
      courseId
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      studentId: req.user._id,
      courseId
    });

    res.status(201).json({ message: 'Successfully enrolled', enrollment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    // Find enrollments and populate the referenced course document
    const enrollments = await Enrollment.find({ studentId: req.user._id })
                                        .populate('courseId');
    
    // Map to an array of just the course objects
    const courses = enrollments.map(e => e.courseId).filter(c => c !== null);
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
