const Course = require('../models/Course');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('instructorId', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const course = await Course.create({
      title,
      description,
      instructorId: req.user._id
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Validate ownership
    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this course' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Validate ownership
    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(id);
    res.json({ message: 'Course successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
