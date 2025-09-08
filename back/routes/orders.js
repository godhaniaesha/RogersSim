const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updateDeliverySlot,
  cancelOrder,
  generateInvoice
} = require('../controllers/orders');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/user', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.get('/:id/invoice', protect, generateInvoice);
router.post('/', protect, createOrder);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/delivery-slot', protect, updateDeliverySlot);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
