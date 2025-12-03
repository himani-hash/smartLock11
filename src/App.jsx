import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);


  useEffect(()=>{
    async function fetchData(){
        const response = await fetch('https://himani.pythonanywhere.com/');
        const data = await response.json()
        console.log("data fet fcho : ", data);
    }
    fetchData()
  },[])

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (userData) => {
    console.log("here");
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? 
              <Navigate to={user.role === 'admin' ? '/admin' : '/user'} /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/admin" 
            element={
              user && user.role === 'admin' ? 
              <AdminDashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/user" 
            element={
              user && user.role === 'user' ? 
              <UserDashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;