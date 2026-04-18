import { useState, useEffect } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';

const StudentDashboard = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allRes, myRes] = await Promise.all([
        api.get('/courses'),
        api.get('/my-courses')
      ]);
      setAllCourses(allRes.data || []);
      setMyCourses(myRes.data || []);
    } catch (err) {
      console.error("Error fetching student data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    setMessage('');
    try {
      await api.post(`/enroll/${courseId}`);
      setMessage('Successfully enrolled in course!');
      fetchData(); // Refresh to update My Courses
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to enroll');
    }
  };

  if (loading) return <div>Loading Student Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h1>Student Dashboard</h1>
      {message && <div className="info-message">{message}</div>}

      <div className="dashboard-section">
        <h2>My Enrolled Courses</h2>
        <div className="course-grid">
          {myCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        {myCourses.length === 0 && <p>You are not enrolled in any courses yet.</p>}
      </div>

      <div className="dashboard-section">
        <h2>Available Courses</h2>
        <div className="course-grid">
          {allCourses.map(course => {
            const isEnrolled = myCourses.some(my => my.id === course.id);
            return (
              <CourseCard 
                key={course.id} 
                course={course} 
                onAction={isEnrolled ? null : handleEnroll} 
                actionLabel={isEnrolled ? null : "Enroll"} 
              />
            );
          })}
        </div>
        {allCourses.length === 0 && <p>No courses available at the moment.</p>}
      </div>
    </div>
  );
};

export default StudentDashboard;
