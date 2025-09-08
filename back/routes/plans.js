const express = require('express');
const {
  getAllPlans,
  getPlansByProductId,
  getPlanById
} = require('../controllers/plans');

const router = express.Router();

router.get('/', getAllPlans);
router.get('/product/:productId', getPlansByProductId);
router.get('/:id', getPlanById);

module.exports = router;
