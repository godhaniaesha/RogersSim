const express = require('express');
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  filterProducts
} = require('../controllers/products');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.post('/filter', filterProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

module.exports = router;
