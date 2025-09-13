const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkoutComplete, requestOtp, activate } = require('../controllers/cards');

router.post('/checkout-complete', protect, checkoutComplete);
router.post('/request-otp', protect, requestOtp);
router.post('/activate', protect, activate);

module.exports = router; 