// src/config/axiosInstance.js
import axios from 'axios';
import { API_BASE_URL } from './api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Function to set the authorization token
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export default axiosInstance;
