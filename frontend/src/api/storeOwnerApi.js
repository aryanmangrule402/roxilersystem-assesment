// src/api/storeOwnerApi.js
import API from './axiosConfig';

export const getStoreOwnerDashboard = async () => {
  const response = await API.get('/store-owner/dashboard');
  return response.data;
};