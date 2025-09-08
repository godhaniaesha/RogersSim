const express = require('express');
const {
  signup,
  login,
  sendOtp,
  verifyOtp,
  googleAuth,
  getMe,
  logout
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;