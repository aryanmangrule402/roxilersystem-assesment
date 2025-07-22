import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

const getAdminDashboardStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching admin dashboard stats:", error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to fetch admin dashboard data.';
    }
};

const getStoreOwnerDashboard = async () => {
    try {
        const response = await axios.get(`${API_URL}/owner`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching store owner dashboard data:", error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to fetch store owner dashboard data.';
    }
};

export const dashboardService = {
    getAdminDashboardStats,
    getStoreOwnerDashboard,
};