const Card = require("../models/Card");
const User = require("../models/User");
const Order = require("../models/Order"); // ✅ import your Order model
const ErrorResponse = require("../utils/errorResponse");

/**
 * Generate a new msisdn from a seed mobile
 */
function generateNewMsisdn(seedMobile) {
  const last4 = (seedMobile || "").slice(-4);
  const prefix = "9" + Math.floor(100000 + Math.random() * 900000).toString();
  return prefix + last4;
}

/**
 * Mark card as sold to a user – barcode must exist in Order & belong to this user
 */
exports.checkoutComplete = async (req, res, next) => {
  try {
    const { barcode } = req.body;
    if (!barcode) return next(new ErrorResponse("Barcode is required", 400));

    // Debug log
    console.log("Barcode from request:", barcode);

    // 1️⃣ Find the order with this barcode
    const order = await Order.findOne({ barcode: barcode.toString() });
    if (!order) {
      console.log("No order found for barcode:", barcode);
      return next(
        new ErrorResponse("Order not found for this barcode", 404)
      );
    }

    // 2️⃣ Ensure the logged-in user owns this order
    if (!order.user || order.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse("You are not allowed to complete this order", 403)
      );
    }

    // 3️⃣ Find or create the card by barcode
    console.log("Looking for card with barcode:", barcode.toString().trim());
    let card = await Card.findOne({ barcode: barcode.toString().trim() });
    
    // If card doesn't exist, create it
    if (!card) {
      console.log("Card not found, creating new card with barcode:", barcode.toString().trim());
      card = await Card.create({
        barcode: barcode.toString().trim(),
        status: 'unassigned'
      });
    }
    
    // Check if card is already active
    if (card.status === "active") {
      return next(new ErrorResponse("Card already active", 400));
    }
    
    // 4️⃣ Mark card as sold & assign owner
    card.status = "sold";
    card.owner = req.user.id;
    await card.save();

    res.status(200).json({ success: true, data: card });
  } catch (err) {
    next(err);
  }
};

/**
 * Send OTP to the owner’s mobile for activation
 */
exports.requestOtp = async (req, res, next) => {
  try {
    const { barcode } = req.body;
    if (!barcode) return next(new ErrorResponse("Barcode is required", 400));

    const card = await Card.findOne({ barcode });
    if (!card) return next(new ErrorResponse("Card not found", 404));

    // Debug logs to see the actual values
    console.log("Card owner:", card.owner, "Type:", typeof card.owner);
    console.log("User ID:", req.user.id, "Type:", typeof req.user.id);
    console.log("Owner toString:", card.owner?.toString());
    console.log("User ID toString:", req.user.id?.toString());

    // Convert both to strings for comparison
    if (!card.owner || card.owner.toString() !== req.user.id.toString()) {
      return next(new ErrorResponse("You do not own this card", 403));
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.mobile) {
      return next(new ErrorResponse("User mobile not found", 400));
    }

    const otp = user.generateOTP();
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // only show OTP in development for debugging
      data: process.env.NODE_ENV === "development" ? { otp } : {},
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Activate card with OTP; assign msisdn
 */
exports.activate = async (req, res, next) => {
  try {
    const { barcode, otp } = req.body;
    if (!barcode || !otp)
      return next(new ErrorResponse("Barcode and OTP are required", 400));

    const card = await Card.findOne({ barcode });
    if (!card) return next(new ErrorResponse("Card not found", 404));
    if (!card.owner || card.owner.toString() !== req.user.id) {
      return next(new ErrorResponse("You do not own this card", 403));
    }

    const user = await User.findById(req.user.id);
    if (!user.verifyOTP(otp)) {
      return next(new ErrorResponse("Invalid or expired OTP", 400));
    }

    // assign a simulated msisdn
    const newNumber = generateNewMsisdn(user.mobile);

    card.status = "active";
    card.msisdn = newNumber;
    card.activatedAt = new Date();
    await card.save();
    await user.save(); // clear OTP etc.

    res.status(200).json({
      success: true,
      data: {
        barcode: card.barcode,
        msisdn: card.msisdn,
        status: card.status,
      },
    });
  } catch (err) {
    next(err);
  }
};
