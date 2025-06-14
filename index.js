const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const supabase = require('./config/supabase');
const productRoutes = require('./routes/products');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.send('✅ SS MART API is running');
});
console.log('✅ Health routes loaded');

// Print Supabase ENV details
console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL}`);
console.log(`SUPABASE_KEY: ${process.env.SUPABASE_KEY ? '✅ Present' : '❌ MISSING'}`);

// Main Product Routes
app.use('/api/products', productRoutes);
console.log('✅ products.js route file loaded');
console.log('✅ Product routes loaded');

// Test Supabase Connectivity and Table
app.get('/api/test-products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error("🔴 Supabase query error:", error.message);
      return res.status(500).json({ success: false, message: 'Test fetch failed', error: error.message });
    }
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unexpected server error', error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 SS-Mart API running on port ${PORT}`);
});
