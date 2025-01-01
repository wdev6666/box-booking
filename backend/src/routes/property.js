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

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - hourlyRate
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "Green Cricket Arena"
 *         description:
 *           type: string
 *           example: "Modern box cricket facility with floodlights"
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *               example: "Mumbai"
 *             address:
 *               type: string
 *             coordinates:
 *               type: object
 *               properties:
 *                 lat:
 *                   type: number
 *                   example: 19.0760
 *                 lng:
 *                   type: number
 *                   example: 72.8777
 *         hourlyRate:
 *           type: number
 *           example: 1500
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Floodlights", "Parking", "Washroom"]
 *         status:
 *           type: string
 *           enum: [active, inactive, maintenance]
 *           example: "active"
 */

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property management endpoints
 */

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - hourlyRate
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: object
 *               hourlyRate:
 *                 type: number
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 property:
 *                   $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only providers can create properties
 */

/**
 * @swagger
 * /api/properties/search:
 *   get:
 *     summary: Search properties
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for property name
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: minRate
 *         schema:
 *           type: number
 *         description: Minimum hourly rate
 *       - in: query
 *         name: maxRate
 *         schema:
 *           type: number
 *         description: Maximum hourly rate
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *     responses:
 *       200:
 *         description: List of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 properties:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */

module.exports = router; 