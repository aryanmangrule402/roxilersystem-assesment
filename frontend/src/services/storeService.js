import axios from 'axios';

const API_URL = 'http://localhost:5000/api/stores';

const getAllStores = async () => {
    try {
        const response = await axios.get(API_URL, { withCredentials: true });
        return response.data.stores;
    } catch (error) {
        console.error("Error fetching all stores:", error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to fetch stores.';
    }
};

const searchStores = async (name, address) => {
    try {
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (address) params.append('address', address);

        const response = await axios.get(`${API_URL}/search?${params.toString()}`, { withCredentials: true });
        return response.data.stores;
    } catch (error) {
        console.error("Error searching stores:", error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to search stores.';
    }
};

const addStore = async (storeData) => {
    try {
        const response = await axios.post(API_URL, storeData, { withCredentials: true });
        return response.data.store;
    } catch (error) {
        console.error("Error adding store:", error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to add store.';
    }
};

export const storeService = {
    getAllStores,
    searchStores,
    addStore,
};