const express = require('express');
const {
  getProfile,
  updateProfile,
  uploadKyc,
  getKycStatus
} = require('../controllers/users');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const { protect } = require('../middleware/auth');
// Multer storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/kyc'); // Make sure this folder exists
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer filter to allow only certain file types (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png, .pdf files are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter,
});
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/kyc', protect,  upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 }
]), uploadKyc);
router.get('/kyc', protect, getKycStatus);

// Address routes
router.use('/addresses', require('./addresses'));

module.exports = router;