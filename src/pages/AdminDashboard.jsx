import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          api.get('/users'),
          api.get('/courses')
        ]);
        setUsers(usersRes.data || []);
        setCourses(coursesRes.data || []);
      } catch (error) {
        console.error("Error fetching admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading Admin Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      
      <div className="dashboard-section">
        <h2>All Users</h2>
        <ul className="user-list">
          {users.map(user => (
            <li key={user.id} className="user-item">
              <strong>{user.name}</strong> - {user.email} <em>({user.role})</em>
            </li>
          ))}
        </ul>
        {users.length === 0 && <p>No users found.</p>}
      </div>

      <div className="dashboard-section">
        <h2>All Courses</h2>
        <ul className="course-list">
          {courses.map(course => (
            <li key={course.id} className="course-item">
              <strong>{course.title}</strong>
              <p>{course.description}</p>
            </li>
          ))}
        </ul>
        {courses.length === 0 && <p>No courses found.</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
