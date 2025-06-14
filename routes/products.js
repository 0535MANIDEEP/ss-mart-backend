const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Debug log on load
console.log('✅ products.js route file loaded');


// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
  console.log('🔍 [GET /api/products] Fetching all products');
  try {
    const { data, error } = await supabase
      .from('products') // Ensure the table name is exactly `products` in lowercase
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Error fetching products:', error.message);
      throw error;
    }

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});


// GET /api/products/:id - Fetch product by ID
router.get('/:id', async (req, res) => {
  console.log(`🔍 [GET /api/products/${req.params.id}] Fetching single product`);
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      console.error('❌ Error fetching product by ID:', error.message);
      throw error;
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Product not found',
      error: error.message
    });
  }
});


// POST /api/products - Create a new product
router.post('/', async (req, res) => {
  console.log('📝 [POST /api/products] Creating product...');
  const { name, description, price, stock, category, image_url } = req.body;

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, stock, category, image_url }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error inserting product:', error.message);
      throw error;
    }

    res.status(201).json({ success: true, message: 'Product created', data });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});


// PUT /api/products/:id - Update a product
router.put('/:id', async (req, res) => {
  console.log(`♻️ [PUT /api/products/${req.params.id}] Updating product`);
  const { name, description, price, stock, category, image_url } = req.body;

  try {
    const { data, error } = await supabase
      .from('products')
      .update({ name, description, price, stock, category, image_url })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating product:', error.message);
      throw error;
    }

    res.json({ success: true, message: 'Product updated', data });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});


// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  console.log(`🗑️ [DELETE /api/products/${req.params.id}] Deleting product`);
  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error deleting product:', error.message);
      throw error;
    }

    res.json({ success: true, message: 'Product deleted', data });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

module.exports = router;
