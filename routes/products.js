const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
  console.log('🔍 [GET /api/products] Fetching all products');
  
  try {
    const { data, error } = await supabase
      .from('products') // ✅ ensure table name is all lowercase
      .select('*')
      .order('id', { ascending: true });

    console.log('📦 Supabase Data:', data);
    console.log('⚠️ Supabase Error:', error);

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    console.error('❌ Failed to fetch products:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products', 
      error: error.message 
    });
  }
});

// GET /api/products/:id - Fetch single product by ID
router.get('/:id', async (req, res) => {
  console.log(`🔍 [GET /api/products/${req.params.id}] Fetching product by ID`);

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    console.log('📦 Supabase Data:', data);
    console.log('⚠️ Supabase Error:', error);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Failed to fetch product:', error.message);
    res.status(404).json({ 
      success: false, 
      message: 'Product not found', 
      error: error.message 
    });
  }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
  const { name, description, price, stock, category, image_url } = req.body;
  console.log('📝 [POST /api/products] Creating product with data:', req.body);

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, stock, category, image_url }])
      .select()
      .single();

    console.log('📦 Supabase Insert Data:', data);
    console.log('⚠️ Supabase Insert Error:', error);

    if (error) throw error;

    res.status(201).json({ success: true, message: 'Product created', data });
  } catch (error) {
    console.error('❌ Failed to create product:', error.message);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to create product', 
      error: error.message 
    });
  }
});

// PUT /api/products/:id - Update an existing product
router.put('/:id', async (req, res) => {
  const { name, description, price, stock, category, image_url } = req.body;
  console.log(`🔄 [PUT /api/products/${req.params.id}] Updating product with data:`, req.body);

  try {
    const { data, error } = await supabase
      .from('products')
      .update({ name, description, price, stock, category, image_url })
      .eq('id', req.params.id)
      .select()
      .single();

    console.log('📦 Supabase Update Data:', data);
    console.log('⚠️ Supabase Update Error:', error);

    if (error) throw error;

    res.json({ success: true, message: 'Product updated', data });
  } catch (error) {
    console.error('❌ Failed to update product:', error.message);
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

    console.log('📦 Supabase Delete Data:', data);
    console.log('⚠️ Supabase Delete Error:', error);

    if (error) throw error;

    res.json({ success: true, message: 'Product deleted', data });
  } catch (error) {
    console.error('❌ Failed to delete product:', error.message);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to delete product', 
      error: error.message 
    });
  }
});

module.exports = router;
