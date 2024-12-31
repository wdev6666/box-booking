const express = require('express');
const router = express.Router();
const {
    listProperties,
    getPropertyDetails
} = require('../controllers/guestController');

// Public routes
router.get('/properties', listProperties);
router.get('/properties/:propertyId', getPropertyDetails);

module.exports = router; 