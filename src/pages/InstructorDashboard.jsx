import { useState, useEffect } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCourseId, setEditingCourseId] = useState(null);

  const fetchCourses = async () => {
    try {
      // Fetch instructor's created courses
      const res = await api.get('/my-courses');
      setCourses(res.data || []);
    } catch (err) {
      console.error("Error fetching instructor courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingCourseId) {
        await api.put(`/courses/${editingCourseId}`, { title, description });
        setEditingCourseId(null);
      } else {
        await api.post('/courses', { title, description });
      }
      setTitle('');
      setDescription('');
      fetchCourses(); // Refresh courses list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourseId(course.id);
    setTitle(course.title);
    setDescription(course.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) return <div>Loading Instructor Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h1>Instructor Dashboard</h1>
      
      <div className="dashboard-section create-course-section">
        <h2>{editingCourseId ? 'Edit Course' : 'Create New Course'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmitCourse} className="create-course-form">
          <div className="form-group">
            <label>Course Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="e.g. Introduction to React"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              placeholder="Course description..."
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary">
              {editingCourseId ? 'Update Course' : 'Create Course'}
            </button>
            {editingCourseId && (
              <button 
                type="button" 
                className="btn-link"
                onClick={() => {
                  setEditingCourseId(null);
                  setTitle('');
                  setDescription('');
                }}
                style={{ padding: '0.75rem', cursor: 'pointer', background: 'transparent', border: 'none', textDecoration: 'underline' }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="dashboard-section">
        <h2>My Managed Courses</h2>
        <div className="course-grid">
          {courses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
        {courses.length === 0 && <p>You haven't created any courses yet.</p>}
      </div>
    </div>
  );
};

export default InstructorDashboard;
