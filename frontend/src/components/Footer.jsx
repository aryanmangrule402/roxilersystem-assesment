// src/components/Footer.jsx
import React from 'react';
import '../index.css';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      textAlign: 'center',
      padding: '1rem',
      position: 'relative',
      bottom: 0,
      width: '100%',
      marginTop: '2rem'
    }}>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Store Ratings. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;