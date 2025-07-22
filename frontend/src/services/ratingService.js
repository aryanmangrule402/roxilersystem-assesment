import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ratings';

const submitRating = async (storeId, rating, comment = '') => {
    try {
        const response = await axios.post(`${API_URL}/${storeId}`, { rating, comment }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error submitting rating:", error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to submit rating.';
    }
};

const updateRating = async (storeId, rating, comment = '') => {
    try {
        const response = await axios.post(`${API_URL}/${storeId}`, { rating, comment }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error updating rating:", error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to update rating.';
    }
};

export const ratingService = {
    submitRating,
    updateRating,
};