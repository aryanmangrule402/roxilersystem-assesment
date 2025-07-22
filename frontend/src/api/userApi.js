// src/api/userApi.js
import API from './axiosConfig';

export const getAllStores = async (filters = {}) => {
  // Pass filters as query parameters
  const params = new URLSearchParams(filters).toString();
  const response = await API.get(`/users/stores?${params}`);
  return response.data;
};

export const submitRating = async (storeId, rating) => {
  const response = await API.post(`/users/stores/${storeId}/ratings`, { rating });
  return response.data;
};

export const modifyRating = async (storeId, rating) => {
  // Assuming your backend uses PUT for modifying existing ratings
  const response = await API.put(`/users/stores/${storeId}/ratings`, { rating });
  return response.data;
};