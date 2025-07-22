// frontend/src/services/api.js

import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConstants';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user')); // Retrieve user from localStorage
        const token = user ? user.token : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling (e.g., token expiration)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If token expires or is invalid (401), redirect to login
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized request. Redirecting to login...");
            localStorage.removeItem('user'); // Clear invalid user data
            window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default api;