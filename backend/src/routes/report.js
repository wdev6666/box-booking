const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const {
    getProviderReports,
    getPropertyReport
} = require('../controllers/reportController');

// Provider report routes
router.get('/provider/reports',
    authenticateToken,
    authorize('Provider'),
    getProviderReports
);

router.get('/provider/properties/:propertyId/report',
    authenticateToken,
    authorize('Provider'),
    getPropertyReport
);

module.exports = router; 