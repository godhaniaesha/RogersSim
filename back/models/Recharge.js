const mongoose = require("mongoose");

const rechargeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    serviceType: {
      type: String,
      enum: ["mobile", "fiber"],
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    plans: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
      },
    ],
    // 👇 added expiry date field
    expireDate: {
      type: Date,
      required: false, // make true if you always need it
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recharge", rechargeSchema);
