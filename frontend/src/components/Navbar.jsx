import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/authApi'; // Import the logout function

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Effect to check login status on component mount and when localStorage changes
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user); // Set isLoggedIn to true if 'user' exists in localStorage
    
    // Optional: Add an event listener for localStorage changes
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('user'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    await logout(); // Call the logout function (clears local storage)
    setIsLoggedIn(false); // Update state
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#f0f0f0' }}>
      <div>
        {/* Example Home Link */}
        <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
        {/* Add other navigation links here based on your app's structure */}
        {/* Example: <Link to="/dashboard">Dashboard</Link> */}
      </div>
      <div>
        {isLoggedIn ? (
          // Show Logout button if logged in
          <button onClick={handleLogout} style={{ padding: '8px 15px', cursor: 'pointer' }}>
            Logout
          </button>
        ) : (
          // Show Login/Register links if not logged in
          <>
            <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;