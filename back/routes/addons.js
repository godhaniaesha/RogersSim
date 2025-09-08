const express = require('express');
const {
  getAllAddons,
  getAddonsByPlanId,
  getAddonById
} = require('../controllers/addons');

const router = express.Router();

router.get('/', getAllAddons);
router.get('/plan/:planId', getAddonsByPlanId);
router.get('/:id', getAddonById);

module.exports = router;
