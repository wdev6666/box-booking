const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PaymentTrackingService = require('./services/paymentTrackingService');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const propertyRoutes = require('./routes/property');
const webhookRoutes = require('./routes/webhook');
const reportRoutes = require('./routes/report');
const guestRoutes = require('./routes/guest');
const bookingRoutes = require('./routes/booking');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Box Cricket Booking API',
        status: 'Active',
        version: '1.0.0'
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', guestRoutes);
app.use('/api', bookingRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.errors
        });
    }

    // Handle Supabase errors
    if (err.status) {
        return res.status(err.status).json({
            error: err.message || 'Supabase Error',
            details: err.details
        });
    }

    // Default error
    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

    // Run payment tracking every 5 minutes
    setInterval(() => {
        PaymentTrackingService.trackPaymentStatus();
    }, 5 * 60 * 1000);
}); 