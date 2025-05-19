const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Route to create a new product (Admin only)
router.post('/', protect, adminOnly, upload.single('image'), createProduct);

// Route to get all products (Any authenticated user)
router.get('/', protect, getAllProducts);

// Route to get a single product by ID (Any authenticated user)
router.get('/:id', protect, getProductById);

// Route to update a product (Admin only)
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct);

// Route to delete a product (Admin only)
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;