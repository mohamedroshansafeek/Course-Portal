import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { parseJwt } from '../utils/auth';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isRegister) {
        response = await api.post('/register', { name, email, password, role });
      } else {
        response = await api.post('/login', { email, password });
      }
      
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      
      const decodedUser = parseJwt(token);
      if (decodedUser && decodedUser.role) {
        if (decodedUser.role === 'admin') navigate('/admin');
        else if (decodedUser.role === 'instructor') navigate('/instructor');
        else if (decodedUser.role === 'student') navigate('/student');
        else navigate('/'); // fallback
      } else {
        setError('Invalid token structure received.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegister ? 'Register for Portal' : 'Login to Portal'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="Enter name"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="btn-primary">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button 
            type="button" 
            className="btn-link" 
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
