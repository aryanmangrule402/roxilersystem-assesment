// src/api/adminApi.js
import API from './axiosConfig';

export const getAdminDashboardStats = async () => {
  const response = await API.get('/admin/dashboard-stats');
  return response.data;
};

export const addStore = async (storeData) => {
  const response = await API.post('/admin/stores', storeData);
  return response.data;
};

export const addUser = async (userData) => {
  const response = await API.post('/admin/users', userData);
  return response.data;
};

export const getAllUsers = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await API.get(`/admin/users?${params}`);
  return response.data;
};

export const getAllStores = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await API.get(`/admin/stores?${params}`);
  return response.data;
};