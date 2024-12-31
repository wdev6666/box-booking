const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    createBooking,
    getUserBookings,
    cancelBooking,
    confirmBookingPayment
} = require('../controllers/bookingController');

// Booking routes
router.post('/:propertyId/slots/:slotId/book',
    authenticateToken,
    createBooking
);

router.post('/:bookingId/confirm-payment',
    authenticateToken,
    confirmBookingPayment
);

router.get('/my-bookings',
    authenticateToken,
    getUserBookings
);

router.post('/bookings/:bookingId/cancel',
    authenticateToken,
    cancelBooking
);

module.exports = router; 