const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    register,
    login,
    requestPasswordReset,
    updatePassword
} = require('../controllers/authController');

// Validation middleware
const registerValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
    body('role').isIn(['Provider', 'User'])
];

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/request-reset', body('email').isEmail(), requestPasswordReset);
router.post('/reset-password', authenticateToken, body('new_password').isLength({ min: 6 }), updatePassword);

module.exports = router; 