import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import './dashboard.css';
import { getApiUrl, API_ENDPOINTS } from '../config';



const AdminDashboard = ({ user, onLogout }) => {
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doorStatus, setDoorStatus] = useState('loading'); // Track door status

  // Fetch door status and logs on load
  useEffect(() => {

    fetchDoorStatus();
    fetchAccessLogs();
  }, []);

  // Get initial door status
  const fetchDoorStatus = async () => {
    try {
      const id = await user.id;
      const response = await axios.get(getApiUrl(API_ENDPOINTS.GET_STATUS), {
        params: { id: id },
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
  // Fetch access logs
  const fetchAccessLogs = async () => {
    try {
      const id = user.id; // get user ID

      const response = await axios.post(getApiUrl(API_ENDPOINTS.GET_LOGS), {
        id: id, // send it in POST body
      });

      console.log("Logs response:", response.data);

      // Assuming backend returns { data: [ { userId, action, time } ] }
      const logs = response.data?.data || [];

      // Match your existing table format
      const formattedLogs = logs.map((log, index) => ({
        id: index + 1,
        username: log.userId,
        access_time: log.time,
        status: log.action,
      }));

      setAccessLogs(formattedLogs);
    } catch (error) {
      console.error("Error fetching access logs:", error);
    } finally {
      setLoading(false);
    }
  };
  // Unlock door
  const unlockDoor = async () => {
    try {
      const id = user.id;

      const response = await axios.post(getApiUrl(API_ENDPOINTS.UNLOCK_DOOR), {
        id: id,
        role: true, // admin role
      });

      console.log("Unlock response:", response.data);

      if (response.data?.isOpen) {
        setDoorStatus('unlocked');
        alert('✅ Door unlocked successfully!');
        fetchAccessLogs();
      } else {
        alert('⚠️ Failed to unlock door.');
      }
    } catch (error) {
      alert('Error unlocking door: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  // Lock door
  const lockDoor = async () => {
    try {
      const id = user.id;

      const response = await axios.post(getApiUrl(API_ENDPOINTS.LOCK_DOOR), {
        id: id,
        role: true, // admin role
      });


      // ✅ Fix: when door is locked, isOpen should be false
      if (!response.data?.isOpen) {
        setDoorStatus('locked');
        alert('🔒 Door locked successfully!');
        fetchAccessLogs();
      } else {
        alert('⚠️ Failed to lock door.');
      }
    } catch (error) {
      alert('Error locking door: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div>
          <span>Welcome, {user.id}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="control-section">
          <h2>Door Control</h2>

          <div className="door-status">
            <div
              className={`status-indicator ${doorStatus === 'locked' ? 'locked' : 'unlocked'
                }`}
            >
              Door Status:{' '}
              {doorStatus === 'loading'
                ? '⏳ Checking...'
                : doorStatus === 'locked'
                  ? '🔒 LOCKED'
                  : '🔓 UNLOCKED'}
            </div>
          </div>

          <div className="control-buttons">
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
           <a 
  href={getApiUrl(API_ENDPOINTS.DOWNLOAD_LOGS_PDF)}
  className="unlock-btn"
  style={{ marginBottom: "1rem" }}
>
  Download Logs as PDF
</a>

<NavLink to="/manage-users" className="unlock-btn">
  Manage Users
</NavLink>

        <div className="logs-table">
          <table>
            <thead>
              <tr>
                <th>Image</th> {/* 👈 New column */}
                <th>User</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {accessLogs.map((log) => (
                <tr key={log.id}>
                  {/* 👇 New image column */}
                  <td>
                    <img
                      src={`https://himani.pythonanywhere.com/get-image/${log.username}.png`}
                      alt={log.username}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.src = '/default-user.png'; // fallback if image not found
                      }}
                    />
                  </td>

                  <td>{log.username}</td>
                  <td>{new Date(log.access_time).toLocaleString()}</td>
                  <td className={`status ${log.status}`}>{log.status}</td>
                  <td>
                    {log.status.includes('unlock') || log.status === 'success'
                      ? '🔓 Unlocked'
                      : log.status.includes('lock')
                        ? '🔒 Locked'
                        : log.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
   

    </div>
  );
};

export default AdminDashboard;
