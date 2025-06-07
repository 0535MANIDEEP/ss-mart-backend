const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root endpoint - MUST be defined before route loading
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to SS-Mart Backend API',
    version: '1.0.0',
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      'products-by-id': '/api/products/:id'
    },
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/products',
      'GET /api/products/:id',
      'POST /api/products',
      'PUT /api/products/:id',
      'DELETE /api/products/:id'
    ]
  });
});

// Try to load routes with error handling
console.log('🔄 Loading routes...');

try {
  console.log('📋 Loading health routes...');
  const healthRoutes = require('./routes/health');
  app.use('/api/health', healthRoutes);
  console.log('✅ Health routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading health routes:', error.message);
}

try {
  console.log('📦 Loading product routes...');
  const productRoutes = require('./routes/products');
  app.use('/api/products', productRoutes);
  console.log('✅ Product routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading product routes:', error.message);
}

try {
  console.log('🛠️ Loading error handler...');
  const errorHandler = require('./middleware/errorHandler');
  console.log('✅ Error handler loaded successfully');
  
  // 404 handler for undefined routes
  app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      method: req.method,
      availableRoutes: [
        'GET /',
        'GET /api/health',
        'GET /api/products',
        'GET /api/products/:id',
        'POST /api/products',
        'PUT /api/products/:id',
        'DELETE /api/products/:id'
      ]
    });
  });

  // Error handling middleware
  app.use(errorHandler);
} catch (error) {
  console.error('❌ Error loading error handler:', error.message);
}

// Debug route to list all registered routes
app.get('/debug/routes', (req, res) => {
  const routes = [];
  
  try {
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        routes.push({
          path: middleware.route.path,
          methods: Object.keys(middleware.route.methods)
        });
      } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            routes.push({
              path: handler.route.path,
              methods: Object.keys(handler.route.methods)
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error getting routes:', error);
  }
  
  res.json({ 
    routes,
    totalRoutes: routes.length,
    timestamp: new Date().toISOString()
  });
});

// Start server with proper binding for deployment
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SS-Mart Backend API is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`🔍 Debug routes: http://localhost:${PORT}/debug/routes`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Log all registered routes on startup
  console.log('\n📋 Registered Routes:');
  app._router.stack.forEach((middleware, index) => {
    if (middleware.route) {
      console.log(`  ${index + 1}. ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router' && middleware.regexp) {
      console.log(`  ${index + 1}. Router: ${middleware.regexp}`);
    }
  });
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;