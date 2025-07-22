// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; // Note: Use default import for jwt-decode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const decodedToken = jwtDecode(parsedUser.token);
        // Check for token expiration
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('user'); // Token expired
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage or decode token:', error);
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
    // Re-check user on window focus for multi-tab sync (optional)
    window.addEventListener('focus', loadUserFromStorage);
    return () => window.removeEventListener('focus', loadUserFromStorage);
  }, [loadUserFromStorage]);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const getRole = () => {
    return user ? user.role : null;
  };

  const getUserId = () => {
    return user ? user.id : null;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, getRole, getUserId }}>
      {children}
    </AuthContext.Provider>
  );
};