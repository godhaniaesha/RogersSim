const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder
} = require('../controllers/orders');

const router = express.Router();
const { protect } = require('../middleware/auth'); // optional if you have auth

router
  .route('/')
  .post(protect, createOrder) // create order
  .get(protect, getOrders); // get all orders

router
  .route('/:id')
  .get(protect, getOrder) // get single order
  .put(protect, updateOrder) // update
  .delete(protect, deleteOrder); // delete

module.exports = router;
