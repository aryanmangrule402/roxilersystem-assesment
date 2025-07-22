import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const addUser = async (userData) => {
    try {
        const response = await axios.post(API_URL, userData, { withCredentials: true });
        return response.data.user;
    } catch (error) {
        console.error("Error adding user:", error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to add user.';
    }
};

const getAllUsers = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.name) params.append('name', filters.name);
        if (filters.email) params.append('email', filters.email);
        if (filters.address) params.append('address', filters.address);
        if (filters.role) params.append('role', filters.role);

        const response = await axios.get(`${API_URL}?${params.toString()}`, { withCredentials: true });
        return response.data.users;
    } catch (error) {
        console.error("Error fetching users:", error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to fetch users.';
    }
};

export const userService = {
    addUser,
    getAllUsers,
};