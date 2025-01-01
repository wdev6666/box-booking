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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials
 */

module.exports = router; 