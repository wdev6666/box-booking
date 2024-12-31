const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
    createProperty,
    getProviderProperties,
    updateProperty,
    searchProperties
} = require('../controllers/propertyController');

// Multer configuration for property photos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 10 // Maximum 10 files
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
            return;
        }
        cb(null, true);
    }
});

// Property routes (Provider only)
router.post('/',
    authenticateToken,
    authorize('Provider'),
    upload.array('photos', 10),
    createProperty
);

router.get('/my-properties',
    authenticateToken,
    authorize('Provider'),
    getProviderProperties
);

router.put('/:propertyId',
    authenticateToken,
    authorize('Provider'),
    updateProperty
);

// Public routes
router.get('/search',
    searchProperties
);

// Include review routes
router.use('/', require('./review'));

// Include availability routes
router.use('/', require('./availability'));

module.exports = router; 