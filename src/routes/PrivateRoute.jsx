import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const PrivateRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their respective dashboard if they try to access unauthorized routes
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'instructor') return <Navigate to="/instructor" replace />;
    return <Navigate to="/student" replace />;
  }

  return children;
};

export default PrivateRoute;
