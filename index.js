const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = require('./config/supabase');

// ✅ Test Supabase connection on startup
supabase
  .from('products')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
    } else {
      console.log('✅ Supabase connected - products available:', data?.length || 0);
    }
  });

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to SS-Mart Backend API',
    version: '1.0.0',
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Load routes
try {
  const healthRoutes = require('./routes/health');
  app.use('/api/health', healthRoutes);
  console.log('✅ Health routes loaded');
} catch (err) {
  console.error('❌ Error loading health routes:', err.message);
}

try {
  const productRoutes = require('./routes/products');
  app.use('/api/products', productRoutes);
  console.log('✅ Product routes loaded');
} catch (err) {
  console.error('❌ Error loading product routes:', err.message);
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
try {
  const errorHandler = require('./middleware/errorHandler');
  app.use(errorHandler);
  console.log('✅ Global error handler registered');
} catch (err) {
  console.error('❌ Error loading error handler:', err.message);
}

// Debug route list
app.get('/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({ path: middleware.route.path, methods: Object.keys(middleware.route.methods) });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({ path: handler.route.path, methods: Object.keys(handler.route.methods) });
        }
      });
    }
  });

  res.json({ routes, total: routes.length });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SS-Mart Backend running at http://localhost:${PORT}`);
  console.log(`📦 Products: GET http://localhost:${PORT}/api/products`);
  console.log(`🩺 Health: GET http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down...');
  server.close(() => {
    console.log('💤 Server terminated gracefully');
  });
});

module.exports = app;
