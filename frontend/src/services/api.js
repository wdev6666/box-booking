import axios from 'axios';
import { store } from '../store';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth?.token;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle session expiry
        if (error.response?.status === 401) {
            store.dispatch({ type: 'auth/logout' });
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default api; 