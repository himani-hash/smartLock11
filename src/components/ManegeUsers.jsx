import React, { useEffect, useState } from "react";
import axios from "axios";
import './dashboard.css';
import { getApiUrl, API_ENDPOINTS } from "../config";

const ManegeUsers = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(getApiUrl(API_ENDPOINTS.GET_ALL_USERS));
      setUsers(response.data.users);
    } catch (err) {
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (oldUsername, newUsername, newPassword) => {
    try {
      const response = await axios.post(getApiUrl(API_ENDPOINTS.UPDATE_USER), {
        oldUsername,
        newUsername,
        newPassword
      });

      if (response.data.success) {
        alert("User updated successfully!");
        fetchUsers();
      }
    } catch (err) {
      alert("Error updating user.");
    }
  };

  const deleteUser = async (username) => {
    if (!window.confirm(`Delete user "${username}"?`)) return;

    try {
      const response = await axios.post(getApiUrl(API_ENDPOINTS.DELETE_USER), {
        username
      });

      if (response.data.success) {
        alert("User deleted!");
        fetchUsers();
      }
    } catch (err) {
      alert("Error deleting user.");
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
        <button onClick={onLogout} className="logout-btn">Logout</button>
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
                    defaultValue={u.username}
                    id={`new-user-${index}`}
                  />
                </td>

                <td>
                  <input 
                    type="password"
                    placeholder="New Password"
                    id={`new-pass-${index}`}
                  />
                </td>

                <td>{u.role}</td>

                <td>
                  <button className="unlock-btn"
                    onClick={() => updateUser(
                      u.username,
                      document.getElementById(`new-user-${index}`).value,
                      document.getElementById(`new-pass-${index}`).value
                    )}
                  >
                    Update
                  </button>
                </td>

                <td>
                  <button className="lock-btn"
                    onClick={() => deleteUser(u.username)}
                  >
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
