import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SkinsInventory from '../components/SkinsInventory';
import SkinSearchModal from '../components/SkinSearchModal';
import './profilePage.css';

function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
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
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>My Account</h1>
          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`tab-button ${activeTab === 'skins' ? 'active' : ''}`}
              onClick={() => setActiveTab('skins')}
            >
              My Skins
            </button>
          </div>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' ? (
            <div className="profile-tab">
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
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="skins-tab">
              <SkinsInventory onOpenSearch={() => setSearchModalOpen(true)} />
            </div>
          )}
        </div>
      </div>

      <SkinSearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}

export default ProfilePage;
