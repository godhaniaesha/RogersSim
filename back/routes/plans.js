const express = require('express');
const {
  getAllPlans,
  getPlansByProductId,
  getPlanById,
  createPlan
} = require('../controllers/plans');

const router = express.Router();

router.get('/', getAllPlans);
router.get('/product/:productId', getPlansByProductId);
router.get('/:id', getPlanById);

router.post('/', createPlan);

module.exports = router;
