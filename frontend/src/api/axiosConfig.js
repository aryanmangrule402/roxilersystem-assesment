// src/api/axiosConfig.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Example: Assuming backend on port 3000 and all API routes start with /api
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration/invalid token (e.g., redirect to login)
    if (error.response && error.response.status === 401 && error.response.data.message === 'Not authorized, token failed') {
      console.log('Token expired or invalid. Logging out...');
      localStorage.removeItem('user');
      // Use window.location.href for a full page reload redirect after logout
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;