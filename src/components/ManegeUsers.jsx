import React, { useEffect, useState } from "react";
import axios from "axios";
import './dashboard.css';
import { getApiUrl, API_ENDPOINTS } from "../config";

const ManegeUsers = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUsers, setEditUsers] = useState({});

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(getApiUrl(API_ENDPOINTS.GET_ALL_USERS));
      setUsers(response.data.users);

      const initialEditState = {};
      response.data.users.forEach((u) => {
        initialEditState[u.username] = { newUsername: u.username, newPassword: "" };
      });
      setEditUsers(initialEditState);

    } catch (err) {
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (username, field, value) => {
    setEditUsers(prev => ({
      ...prev,
      [username]: {
        ...prev[username],
        [field]: value
      }
    }));
  };

  // Update user
  const updateUser = async (oldUsername) => {
    const { newUsername, newPassword } = editUsers[oldUsername];

    // Validation
    if (!newUsername.trim()) {
      alert("Username cannot be empty.");
      return;
    }
    if (oldUsername === "admin" && newUsername !== "admin") {
      alert("Cannot rename the admin account.");
      return;
    }

    try {
      const response = await axios.post(getApiUrl(API_ENDPOINTS.UPDATE_USER), {
        oldUsername,
        newUsername,
        newPassword
      });

      if (response.data.success) {
        alert("User updated successfully!");
        fetchUsers();
      } else {
        alert(response.data.message || "Error updating user.");
      }
    } catch (err) {
      alert("Error updating user.");
    }
  };

  // Delete user
  const deleteUser = async (username) => {
    if (username === "admin") {
      alert("Cannot delete the admin account!");
      return;
    }

    if (!window.confirm(`Delete user "${username}"?`)) return;

    try {
      const response = await axios.post(getApiUrl(API_ENDPOINTS.DELETE_USER), { username });

      if (response.data.success) {
        alert("User deleted!");
        fetchUsers();
      } else {
        alert(response.data.message || "Error deleting user.");
      }
    } catch (err) {
      alert("Error deleting user.");
    }
  };

  // Download logs PDF
  const downloadLogsPDF = async () => {
    try {
      const response = await axios.get(getApiUrl(API_ENDPOINTS.DOWNLOAD_LOGS_PDF), {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'access_logs.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download logs PDF.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <h2>Loading users...</h2>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>User Management</h1>
        <div>
          <button onClick={downloadLogsPDF} className="pdf-btn">Download Logs PDF</button>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <h2>Manage Users</h2>
        <table>
          <thead>
            <tr>
              <th>Old Username</th>
              <th>New Username</th>
              <th>New Password</th>
              <th>Role</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={index}>
                <td>{u.username}</td>

                <td>
                  <input 
                    type="text"
                    value={editUsers[u.username]?.newUsername || ""}
                    onChange={(e) => handleInputChange(u.username, "newUsername", e.target.value)}
                  />
                </td>

                <td>
                  <input 
                    type="password"
                    placeholder="New Password"
                    value={editUsers[u.username]?.newPassword || ""}
                    onChange={(e) => handleInputChange(u.username, "newPassword", e.target.value)}
                  />
                </td>

                <td>{u.role}</td>

                <td>
                  <button className="unlock-btn" onClick={() => updateUser(u.username)}>
                    Update
                  </button>
                </td>

                <td>
                  <button className="lock-btn" onClick={() => deleteUser(u.username)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManegeUsers;
