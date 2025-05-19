const Product = require('../models/Product');
const fs = require('fs').promises;
const path = require('path');

// @desc    Create a new product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a product image' });
    }

    // Validate price
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      return res.status(400).json({ message: 'Please provide a valid price' });
    }

    // Create new product (admin is creating, so use their ID)
    const product = await Product.create({
      title,
      description,
      price: priceValue,
      imageUrl: req.file.path,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: {
        _id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl
      }
    });
  } catch (error) {
    console.error(error);
    // Remove uploaded file if product creation fails
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    res.status(500).json({ 
      message: 'Server error creating product',
      error: error.message 
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Find products with pagination
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)
      .select('title description price imageUrl createdAt');

    // Count total products
    const totalProducts = await Product.countDocuments();

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error fetching products',
      error: error.message 
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('title description price imageUrl createdAt');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error fetching product',
      error: error.message 
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    
    // Find the product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate price if provided
    if (price !== undefined) {
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue < 0) {
        return res.status(400).json({ message: 'Please provide a valid price' });
      }
      product.price = priceValue;
    }

    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;

    // Update image if new file is uploaded
    if (req.file) {
      // Remove old image file if exists
      if (product.imageUrl) {
        try {
          await fs.unlink(product.imageUrl);
        } catch (unlinkError) {
          console.error('Error deleting old image:', unlinkError);
        }
      }
      product.imageUrl = req.file.path;
    }

    // Save updated product
    await product.save();

    res.json({
      message: 'Product updated successfully',
      product: {
        _id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl
      }
    });
  } catch (error) {
    console.error(error);
    // Remove uploaded file if update fails
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    res.status(500).json({ 
      message: 'Server error updating product',
      error: error.message 
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    // Find the product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Remove the product image file
    if (product.imageUrl) {
      try {
        await fs.unlink(product.imageUrl);
      } catch (unlinkError) {
        console.error('Error deleting product image:', unlinkError);
      }
    }

    // Remove the product from database
    await product.deleteOne();

    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error deleting product',
      error: error.message 
    });
  }
};