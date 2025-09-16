const Recharge = require("../models/Recharge");
const Plan = require("../models/Plan");

/**
 * Helper to add validity on top of a base date
 */
function addValidityToDate(validity, baseDate = new Date()) {
  const d = new Date(baseDate); // clone

  switch (validity) {
    case "1_day":
      return new Date(d.getTime() + 1 * 24 * 60 * 60 * 1000);
    case "1_month":
      d.setMonth(d.getMonth() + 1);
      return d;
    case "3_months":
      d.setMonth(d.getMonth() + 3);
      return d;
    case "6_months":
      d.setMonth(d.getMonth() + 6);
      return d;
    case "1_year":
      d.setFullYear(d.getFullYear() + 1);
      return d;
    case "2_years":
      d.setFullYear(d.getFullYear() + 2);
      return d;
    case "lifetime":
      return null;
    default:
      return null;
  }
}

// ----------------- Controllers -----------------

// Create or update Recharge (user+number unique)
exports.createRecharge = async (req, res) => {
  try {
    const { user, serviceType, number, plans } = req.body;

    let expireDate = null;
    let firstPlan = null;

    // If plans passed, calculate expire date from first plan
    if (plans && plans.length > 0) {
      firstPlan = await Plan.findById(plans[0]);
      if (!firstPlan) {
        return res
          .status(404)
          .json({ success: false, message: "Plan not found" });
      }
    }

    // check if recharge already exists for user+number
    let recharge = await Recharge.findOne({ user, number });

    if (recharge) {
      // update existing recharge instead of creating new one
      if (firstPlan) {
        let baseDate = new Date();
        if (recharge.expireDate && recharge.expireDate > new Date()) {
          baseDate = new Date(recharge.expireDate);
        }
        expireDate = addValidityToDate(firstPlan.validity, baseDate);
      }

      if (plans && plans.length > 0) {
        recharge.plans = plans;
      }
      recharge.serviceType = serviceType;
      recharge.expireDate = expireDate;
      await recharge.save();
    } else {
      // create new recharge
      if (firstPlan) {
        expireDate = addValidityToDate(firstPlan.validity, new Date());
      }
      recharge = new Recharge({
        user,
        serviceType,
        number,
        plans: plans || [],
        expireDate,
      });
      await recharge.save();
    }

    const populatedRecharge = await Recharge.findById(recharge._id)
      .populate("plans")
      .populate("user");

    res.status(201).json({ success: true, data: populatedRecharge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Recharges
exports.getAllRecharges = async (req, res) => {
  try {
    const recharges = await Recharge.find()
      .populate("plans")
      .populate("user");
    res.status(200).json({ success: true, data: recharges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Recharge by ID
exports.getRechargeById = async (req, res) => {
  try {
    const recharge = await Recharge.findById(req.params.id)
      .populate("plans")
      .populate("user");
    if (!recharge)
      return res
        .status(404)
        .json({ success: false, message: "Recharge not found" });
    res.status(200).json({ success: true, data: recharge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Recharge (edit number / serviceType / plans / expireDate)
exports.updateRecharge = async (req, res) => {
  try {
    const { serviceType, number, plans, expireDate } = req.body;

    const updateData = {};
    if (serviceType) updateData.serviceType = serviceType;
    if (number) updateData.number = number;
    if (plans) updateData.plans = plans;
    if (expireDate) updateData.expireDate = expireDate;

    const updatedRecharge = await Recharge.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("plans")
      .populate("user");

    if (!updatedRecharge) {
      return res
        .status(404)
        .json({ success: false, message: "Recharge not found" });
    }

    res.status(200).json({ success: true, data: updatedRecharge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Recharge
exports.deleteRecharge = async (req, res) => {
  try {
    const deletedRecharge = await Recharge.findByIdAndDelete(req.params.id);
    if (!deletedRecharge)
      return res
        .status(404)
        .json({ success: false, message: "Recharge not found" });

    res
      .status(200)
      .json({ success: true, message: "Recharge deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Buy Plan (extend expiry on existing recharge)
exports.buyPlan = async (req, res) => {
  try {
    const { userId, number, planId } = req.body;

    const recharge = await Recharge.findOne({ user: userId, number });
    if (!recharge)
      return res
        .status(404)
        .json({ success: false, message: "Recharge not found for this user & number" });

    const plan = await Plan.findById(planId);
    if (!plan)
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });

    // decide base date:
    let baseDate = new Date();
    if (recharge.expireDate && recharge.expireDate > new Date()) {
      baseDate = new Date(recharge.expireDate); // extend from existing expiry
    }

    recharge.expireDate = addValidityToDate(plan.validity, baseDate);

    // replace or append plan as per your requirement:
    recharge.plans = [planId]; // if you always want one plan
    // OR recharge.plans.push(planId); if you want multiple history

    await recharge.save();

    const populatedRecharge = await Recharge.findById(recharge._id)
      .populate("plans")
      .populate("user");

    res.status(200).json({ success: true, data: populatedRecharge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get Recharges of Logged-in User
exports.getMyRecharges = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const myRecharges = await Recharge.find({ user: userId })
      .populate("plans")
      .populate("user")
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      count: myRecharges.length,
      data: myRecharges,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
