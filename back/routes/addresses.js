const express = require('express');
const router = express.Router();
const {
  addAddress,
  getAddresses,
  editAddress,
  deleteAddress
} = require('../controllers/addresses');
const { protect } = require('../middleware/auth');

router.post('/', protect, addAddress);  
router.get('/', protect, getAddresses);  
router.put('/:addressIndex', protect, editAddress);  
router.delete('/:addressIndex', protect, deleteAddress);  

module.exports = router;
