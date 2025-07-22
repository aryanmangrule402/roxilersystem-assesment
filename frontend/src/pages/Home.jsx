// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../index.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
      <h1>Welcome to Store Ratings Platform!</h1>
      <p>Submit and view ratings for your favorite stores.</p>

      {!isAuthenticated ? (
        <div style={{ marginTop: '2rem' }}>
          <Link to="/login" style={{ marginRight: '1rem' }} className="button">Login</Link>
          <Link to="/register" className="button">Register</Link>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <p>You are logged in as **{user?.email}** ({user?.role}).</p>
          {user?.role === 'system_admin' && (
            <Link to="/admin/dashboard" className="button">Go to Admin Dashboard</Link>
          )}
          {user?.role === 'store_owner' && (
            <Link to="/store-owner/dashboard" className="button">Go to Store Owner Dashboard</Link>
          )}
          {user?.role === 'normal_user' && (
            <Link to="/user/stores" className="button">View Stores</Link>
          )}
          <Link to="/profile/update-password" style={{ marginLeft: '1rem' }} className="button">Update Password</Link>
        </div>
      )}
    </div>
  );
};

export default Home;