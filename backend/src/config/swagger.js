const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Box Cricket Booking API',
      version: '1.0.0',
      description: 'API documentation for Box Cricket Ground Booking System',
      contact: {
        name: 'API Support',
        email: 'support@boxcricket.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 