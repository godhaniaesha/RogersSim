const Recharge = require("../models/Recharge");
const Plan = require("../models/Plan");

// Create Recharge (with user reference)
exports.createRecharge = async (req, res) => {
  try {
    const { user, serviceType, number, plans } = req.body;

    // ❌ Remove single recharge restriction
    // const existing = await Recharge.findOne({ user });
    // if (existing) { 
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Recharge already exists for this user" });
    // }

    // ✅ Allow multiple recharges
    const newRecharge = new Recharge({
      user,
      serviceType,
      number,
      plans: plans || []
    });

    await newRecharge.save();

    // Populate user & plans in response
    const populatedRecharge = await Recharge.findById(newRecharge._id)
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
            .populate("user"); // populate user details also
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

// Update Recharge (edit number / serviceType)
// Update Recharge (edit number / serviceType / plans)
exports.updateRecharge = async (req, res) => {
    try {
        const { serviceType, number, plans } = req.body;

        const updateData = {};
        if (serviceType) updateData.serviceType = serviceType;
        if (number) updateData.number = number;
        if (plans) updateData.plans = plans; // ✅ update plans array

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

// Buy Plan (push planId into recharge's plans array)
exports.buyPlan = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        const recharge = await Recharge.findOne({ user: userId }); // find recharge by user
        if (!recharge)
            return res
                .status(404)
                .json({ success: false, message: "Recharge not found for this user" });

        const plan = await Plan.findById(planId);
        if (!plan)
            return res
                .status(404)
                .json({ success: false, message: "Plan not found" });

        // Add plan if not already purchased
        if (!recharge.plans.includes(planId)) {
            recharge.plans.push(planId);
            await recharge.save();
        }

        res.status(200).json({ success: true, data: recharge });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
