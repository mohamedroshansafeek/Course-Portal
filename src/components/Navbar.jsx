import { useNavigate } from 'react-router-dom';
import { getUserRole, logout } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const role = getUserRole();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!role) return null; // Don't show navbar on login or unauthenticated pages

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Course Portal</h2>
      </div>
      <div className="navbar-menu">
        <span className="role-badge">Role: {role}</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
