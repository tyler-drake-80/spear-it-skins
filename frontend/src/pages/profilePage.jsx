import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './authPages.css';

function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Profile</h1>
        
        <div className="profile-info">
          <div className="info-group">
            <label>Username</label>
            <p>{user.username}</p>
          </div>

          <div className="info-group">
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <div className="info-group">
            <label>Member ID</label>
            <p>{user.id}</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="btn btn-danger btn-block"
          style={{ marginTop: '30px' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
