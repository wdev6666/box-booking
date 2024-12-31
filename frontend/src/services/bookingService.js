import api from './api';

const bookingService = {
    getAvailableSlots: async (propertyId, date) => {
        try {
            const response = await api.get(`/properties/${propertyId}/availability`, {
                params: { date }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch available slots';
        }
    },

    createBooking: async (propertyId, slotId, bookingData) => {
        try {
            const response = await api.post(
                `/properties/${propertyId}/slots/${slotId}/book`,
                bookingData
            );
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to create booking';
        }
    },

    getUserBookings: async (status) => {
        try {
            const response = await api.get('/bookings/my-bookings', {
                params: { status }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to fetch bookings';
        }
    },

    cancelBooking: async (bookingId) => {
        try {
            const response = await api.post(`/bookings/${bookingId}/cancel`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Failed to cancel booking';
        }
    }
};

export default bookingService; 