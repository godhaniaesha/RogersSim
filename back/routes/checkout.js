const express = require('express');
const {
  createCheckout,
  getAllCheckouts,
  getCheckout,
  updateCheckout,
  deleteCheckout,
  updatePaymentStatus,
  updateOrderStatus,
  addEmiPayment
} = require('../controllers/checkout');

const { protect } = require('../middleware/auth'); // your auth middleware

const router = express.Router();

/**
 * @route   POST /api/checkout
 * @desc    Create new checkout/order (requires login)
 */
router.post('/', protect, createCheckout);

/**
 * @route   GET /api/checkout
 * @desc    Get all checkouts (admin usage)
 */
router.get('/', protect, getAllCheckouts);

/**
 * @route   GET /api/checkout/:id
 * @desc    Get single checkout by ID
 */
router.get('/:id', protect, getCheckout);

/**
 * @route   PUT /api/checkout/:id
 * @desc    Update checkout (like items, shippingAddress etc.)
 */
router.put('/:id', protect, updateCheckout);

/**
 * @route   DELETE /api/checkout/:id
 * @desc    Delete checkout
 */
router.delete('/:id', protect, deleteCheckout);

/**
 * @route   PATCH /api/checkout/:id/payment-status
 * @desc    Update payment status of checkout
 */
router.patch('/:id/payment-status', protect, updatePaymentStatus);

/**
 * @route   PATCH /api/checkout/:id/order-status
 * @desc    Update order status of checkout
 */
router.patch('/:id/order-status', protect, updateOrderStatus);

router.post('/:id/emi-payment', protect, addEmiPayment);

module.exports = router;
