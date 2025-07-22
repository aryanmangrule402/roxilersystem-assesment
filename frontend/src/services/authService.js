import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/api/auth';

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password }, {
            withCredentials: true,
        });

        if (response.data.user) {
            localStorage.setItem('userRole', response.data.user.role);
            localStorage.setItem('userName', response.data.user.name);
            return response.data.user;
        }
        throw new Error('Login failed: No user data in response.');

    } catch (error) {
        console.error("Login error:", error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Login failed. Please check your credentials.';
    }
};

const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, {
            withCredentials: true,
        });

        if (response.data.user) {
            localStorage.setItem('userRole', response.data.user.role);
            localStorage.setItem('userName', response.data.user.name);
            return response.data.user;
        }
        throw new Error('Registration failed: No user data in response.');

    } catch (error) {
        console.error("Register error:", error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Registration failed.';
    }
};

const logout = async () => {
    try {
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
    } catch (error) {
        console.error("Logout error:", error.response?.data?.message || error.message);
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
    }
};

const checkSession = async () => {
    try {
        const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
        return response.data.user; // Assuming backend /me returns { user: { id, name, email, role } }
    } catch (error) {
        console.error("Session check failed:", error.response?.data?.message || error.message);
        logout();
        throw error;
    }
};

const getUserRole = () => {
    return localStorage.getItem('userRole');
};

export const authService = {
    login,
    register,
    logout,
    getUserRole,
    checkSession,
};