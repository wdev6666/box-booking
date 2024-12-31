const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
    createAvailabilitySlot,
    getPropertyAvailability,
    updateAvailabilitySlot,
    createRecurringAvailability,
    getCalendarView
} = require('../controllers/availabilityController');

// Validation middleware
const slotValidation = [
    body('startTime').isISO8601().toDate(),
    body('endTime').isISO8601().toDate(),
    body('priceOverride').optional().isNumeric()
];

const recurringValidation = [
    body('startDate').isISO8601().toDate(),
    body('endDate').isISO8601().toDate(),
    body('dailyStartTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body('dailyEndTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body('daysOfWeek').isArray().custom(days => days.every(day => day >= 0 && day <= 6)),
    body('priceOverride').optional().isNumeric()
];

// Routes
router.post('/:propertyId/availability',
    authenticateToken,
    authorize('Provider'),
    slotValidation,
    createAvailabilitySlot
);

router.get('/:propertyId/availability',
    getPropertyAvailability
);

router.put('/:propertyId/availability/:slotId',
    authenticateToken,
    authorize('Provider'),
    updateAvailabilitySlot
);

router.post('/:propertyId/availability/recurring',
    authenticateToken,
    authorize('Provider'),
    recurringValidation,
    createRecurringAvailability
);

router.get('/:propertyId/calendar',
    getCalendarView
);

module.exports = router; 