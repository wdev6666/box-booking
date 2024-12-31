import api from './api';

const propertyService = {
    getAllProperties: async (filters = {}) => {
        try {
            const response = await api.get('/properties', { params: filters });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch properties';
        }
    },

    getPropertyDetails: async (id) => {
        try {
            const response = await api.get(`/properties/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch property details';
        }
    }
};

export default propertyService; 