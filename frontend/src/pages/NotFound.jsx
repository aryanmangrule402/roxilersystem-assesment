// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const NotFound = () => {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--error-color)' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="button">Go to Home</Link>
    </div>
  );
};

export default NotFound;