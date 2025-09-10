const express = require('express');
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  filterProducts,
  createProduct
} = require('../controllers/products');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.post('/filter', filterProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.post('/', protect, authorize('admin'), createProduct);

// Admin routes
// router.post('/', protect, authorize('admin'), createProduct);

module.exports = router;
