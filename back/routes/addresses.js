const express = require('express');
const {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require('../controllers/addresses');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', protect, getUserAddresses);
router.post('/', protect, addAddress);
router.put('/:id', protect, updateAddress);
router.put('/:id/default', protect, setDefaultAddress);
router.delete('/:id', protect, deleteAddress);

module.exports = router;
