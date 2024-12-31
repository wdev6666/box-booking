import axios from 'axios';
import { store } from '../store';
import { setCredentials, setLoading, setError, logout } from '../store/slices/authSlice';
import { showNotification } from '../store/slices/notificationSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with interceptors
const api = axios.create({
    baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const authService = {
    login: async (email, password) => {
        try {
            store.dispatch(setLoading(true));
            const response = await api.post('/auth/login', {
                email,
                password
            });
            
            const { user, token } = response.data;
            store.dispatch(setCredentials({ user, token }));
            store.dispatch(showNotification({
                message: 'Login successful!',
                type: 'success'
            }));
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            store.dispatch(setError(message));
            store.dispatch(showNotification({
                message,
                type: 'error'
            }));
            throw new Error(message);
        } finally {
            store.dispatch(setLoading(false));
        }
    },

    register: async (userData) => {
        try {
            store.dispatch(setLoading(true));
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || 'Registration failed';
            store.dispatch(setError(message));
            throw new Error(message);
        } finally {
            store.dispatch(setLoading(false));
        }
    },

    requestPasswordReset: async (email) => {
        try {
            store.dispatch(setLoading(true));
            const response = await api.post('/auth/request-reset', { email });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || 'Password reset request failed';
            store.dispatch(setError(message));
            throw new Error(message);
        } finally {
            store.dispatch(setLoading(false));
        }
    },

    logout: () => {
        store.dispatch(logout());
        localStorage.removeItem('user');
        store.dispatch(showNotification({
            message: 'Logged out successfully',
            type: 'info'
        }));
    }
};

export default authService; 