import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';
import { getApiUrl, API_ENDPOINTS } from '../config';

const UserDashboard = ({ user, onLogout }) => {
  const [doorStatus, setDoorStatus] = useState('loading');

  // Fetch initial door status
  useEffect(() => {
    const fetchDoorStatus = async () => {
      console.log(getApiUrl(API_ENDPOINTS.GET_STATUS));
      
      try {
        const response = await axios.get(getApiUrl(API_ENDPOINTS.GET_STATUS), {
          params: { id: user.id },
        });
        
        
        if (response.data?.status) {
          setDoorStatus('unlocked');
        } else {
          setDoorStatus('locked');
        }
      } catch (error) {
        console.error('Error getting door status:', error);
        alert('⚠️ Failed to get door status.');
        setDoorStatus('unknown');
      }
    };

    fetchDoorStatus();
  }, [user.id]);

  // Unlock the door
  const unlockDoor = async () => {
    try {
      const response = await axios.post(getApiUrl(API_ENDPOINTS.UNLOCK_DOOR), {
        id: user.id,
      });

      if (response.data?.isOpen) {
        setDoorStatus('unlocked');
        alert('✅ Door unlocked successfully!');
      } else {
        alert('⚠️ Failed to unlock door.');
      }
    } catch (error) {
      console.log(error);
      
      alert('Error unlocking door: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  // Lock the door
  const lockDoor = async () => {
    try {
      const response = await axios.post(getApiUrl(API_ENDPOINTS.LOCK_DOOR), {
        id: user.id,
      });

      if (!response.data?.isOpen) {
        setDoorStatus('locked');
        alert('🔒 Door locked successfully!');
      } else {
        alert('⚠️ Failed to lock door.');
      }
    } catch (error) {
      alert('Error locking door: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}!</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      <div className="dashboard-content user-content">
        <div className="user-info">
          <h2>Door Access Control</h2>

          <div className="door-status">
            <div className={`status-indicator ${doorStatus === 'locked' ? 'locked' : 'unlocked'}`}>
              Door Status:{' '}
              {doorStatus === 'loading'
                ? '⏳ Checking...'
                : doorStatus === 'locked'
                ? '🔒 LOCKED'
                : '🔓 UNLOCKED'}
            </div>
          </div>

          <div className="button-group">
            <button
              onClick={unlockDoor}
              className="unlock-btn"
              disabled={doorStatus === 'unlocked' || doorStatus === 'loading'}
            >
              Unlock Door
            </button>

            <button
              onClick={lockDoor}
              className="lock-btn"
              disabled={doorStatus === 'locked' || doorStatus === 'loading'}
            >
              Lock Door
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
