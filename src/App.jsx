import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import PrivateRoute from './routes/PrivateRoute';
import { getUserRole } from './utils/auth';

function App() {
  const getDefaultRoute = () => {
    const role = getUserRole();
    if (role === 'admin') return '/admin';
    if (role === 'instructor') return '/instructor';
    if (role === 'student') return '/student';
    return '/login';
  };

  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/instructor/*" 
            element={
              <PrivateRoute allowedRoles={['instructor']}>
                <InstructorDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/student/*" 
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
