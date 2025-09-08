const express = require('express');
const {
  getProfile,
  updateProfile,
  uploadKyc,
  getKycStatus
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/kyc', protect, uploadKyc);
router.get('/kyc', protect, getKycStatus);

// Address routes
router.use('/addresses', require('./addresses'));

module.exports = router;