const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
    createReview,
    getPropertyReviews
} = require('../controllers/reviewController');

// Validation middleware
const reviewValidation = [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().isLength({ min: 10, max: 500 })
        .withMessage('Comment must be between 10 and 500 characters')
];

// Routes
router.post('/:propertyId/reviews',
    authenticateToken,
    reviewValidation,
    createReview
);

router.get('/:propertyId/reviews',
    getPropertyReviews
);

module.exports = router; 