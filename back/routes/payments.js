const express = require('express');
const {
  processPayment,
  verifyPayment,
  calculateEmi,
  getPaymentHistory,
  getPaymentById,
  initiateRefund
} = require('../controllers/payments');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', protect, getPaymentHistory);
router.get('/:id', protect, getPaymentById);
router.post('/', protect, processPayment);
router.post('/verify', protect, verifyPayment);
router.post('/calculate-emi', calculateEmi);
router.post('/:id/refund', protect, initiateRefund);

module.exports = router;
