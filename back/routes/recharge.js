const express = require("express");
const router = express.Router();
const rechargeController = require("../controllers/recharge");

// CRUD routes
router.post("/", rechargeController.createRecharge);
router.get("/", rechargeController.getAllRecharges);
router.get("/:id", rechargeController.getRechargeById);
router.put("/:id", rechargeController.updateRecharge);
router.delete("/:id", rechargeController.deleteRecharge);

// Buy Plan route
router.post("/buy-plan", rechargeController.buyPlan);

module.exports = router;
