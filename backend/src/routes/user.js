const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
    getUserDashboard,
    getProfile,
    updateProfile,
    uploadAvatar,
    createProfile
} = require('../controllers/userController');

// Multer configuration for handling file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
            return;
        }
        cb(null, true);
    }
});

// Protected routes with role-based authorization
router.get('/dashboard', authenticateToken, getUserDashboard);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/profile/avatar', 
    authenticateToken,
    upload.single('avatar'),
    uploadAvatar
);

// Provider-only routes
router.get('/provider/stats', 
    authenticateToken, 
    authorize('Provider'),
    (req, res) => {
        res.json({
            message: 'Provider stats',
            stats: {
                totalGrounds: 5,
                activeBookings: 10,
                monthlyRevenue: 50000
            }
        });
    }
);

// User-only routes
router.get('/user/bookings', 
    authenticateToken, 
    authorize('User'),
    (req, res) => {
        res.json({
            message: 'User bookings',
            bookings: [
                { id: 1, status: 'confirmed', date: '2024-04-01' },
                { id: 2, status: 'pending', date: '2024-04-05' }
            ]
        });
    }
);

router.post('/profile/create', authenticateToken, createProfile);

module.exports = router; 