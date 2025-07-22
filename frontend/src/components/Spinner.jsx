// src/components/Spinner.jsx
import React from 'react';
import '../index.css'; // Ensure your global CSS is imported for spinner styles

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;