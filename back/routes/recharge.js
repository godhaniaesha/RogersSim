const express = require("express");
const router = express.Router();
const { createRecharge, getAllRecharges, getMyRecharges, getRechargeById, updateRecharge, deleteRecharge, buyPlan } = require("../controllers/recharge");
const {protect} = require("../middleware/auth"); // Add this at the top if not already imported

// CRUD routes
router.post("/", createRecharge);
router.get("/", getAllRecharges);
router.get("/my", protect, getMyRecharges);
router.get("/:id", getRechargeById);
router.put("/:id", updateRecharge);
router.delete("/:id", deleteRecharge);


// Buy Plan route
router.post("/buy-plan", buyPlan);

module.exports = router;
