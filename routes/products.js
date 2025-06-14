const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
});

// GET /api/products/:id - Fetch product by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Product not found', error: error.message });
  }
});

// POST /api/products - Create a product
router.post('/', async (req, res) => {
  const { name, description, price, stock, category, image_url } = req.body;

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, stock, category, image_url }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, message: 'Product created', data });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create product', error: error.message });
  }
});

// PUT /api/products/:id - Update a product
router.put('/:id', async (req, res) => {
  const { name, description, price, stock, category, image_url } = req.body;

  try {
    const { data, error } = await supabase
      .from('products')
      .update({ name, description, price, stock, category, image_url })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, message: 'Product updated', data });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update product', error: error.message });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, message: 'Product deleted', data });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;
