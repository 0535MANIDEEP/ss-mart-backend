const express = require('express');
const router = express.Router();

// Sample in-memory product data for development
let products = [
  {
    id: 1,
    name: "Premium Toothbrush",
    description: "Soft bristles for gentle cleaning",
    price: 49,
    stock: 100,
    category: "Personal Care",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Organic Shampoo",
    description: "Natural ingredients for healthy hair",
    price: 120,
    stock: 75,
    category: "Personal Care",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Hand Sanitizer",
    description: "99.9% germ protection",
    price: 35,
    stock: 200,
    category: "Health",
    createdAt: new Date().toISOString()
  }
];

// GET /api/products - Retrieve all products
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message
    });
  }
});

// GET /api/products/:id - Retrieve a specific product
router.get('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message
    });
  }
});

// POST /api/products - Add a new product
router.post('/', (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    
    // Validation
    if (!name || price == null || stock == null) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, price, and stock are required'
      });
    }
    
    if (price < 0 || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price and stock must be non-negative numbers'
      });
    }
    
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: name.trim(),
      description: description ? description.trim() : '',
      price: parseFloat(price),
      stock: parseInt(stock),
      category: category ? category.trim() : 'General',
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

// PUT /api/products/:id - Update a product
router.put('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const { name, description, price, stock, category } = req.body;
    
    // Validation
    if (price != null && price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be non-negative'
      });
    }
    
    if (stock != null && stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock must be non-negative'
      });
    }
    
    // Update product
    const updatedProduct = {
      ...products[productIndex],
      name: name ? name.trim() : products[productIndex].name,
      description: description !== undefined ? description.trim() : products[productIndex].description,
      price: price != null ? parseFloat(price) : products[productIndex].price,
      stock: stock != null ? parseInt(stock) : products[productIndex].stock,
      category: category ? category.trim() : products[productIndex].category,
      updatedAt: new Date().toISOString()
    };
    
    products[productIndex] = updatedProduct;
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const deletedProduct = products.splice(productIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

module.exports = router;