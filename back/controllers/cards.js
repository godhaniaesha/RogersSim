const Card = require('../models/Card');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// mark card as sold to a user
exports.checkoutComplete = async (req, res, next) => {
  try {
    const { barcode } = req.body;
    if (!barcode) return next(new ErrorResponse('Barcode is required', 400));

    const card = await Card.findOne({ barcode });
    if (!card) return next(new ErrorResponse('Card not found', 404));
    if (card.status === 'active') return next(new ErrorResponse('Card already active', 400));

    card.status = 'sold';
    card.owner = req.user.id;
    await card.save();

    res.status(200).json({ success: true, data: card });
  } catch (err) {
    next(err);
  }
};

// send OTP to the owner’s mobile for activation
exports.requestOtp = async (req, res, next) => {
  try {
    const { barcode } = req.body;
    if (!barcode) return next(new ErrorResponse('Barcode is required', 400));

    const card = await Card.findOne({ barcode });
    if (!card) return next(new ErrorResponse('Card not found', 404));

    if (!card.owner || card.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('You do not own this card', 403));
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.mobile) {
      return next(new ErrorResponse('User mobile not found', 400));
    }

    const otp = user.generateOTP();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: process.env.NODE_ENV === 'development' ? { otp } : {}
    });
  } catch (err) {
    next(err);
  }
};

// activate card with OTP; assign msisdn
exports.activate = async (req, res, next) => {
  try {
    const { barcode, otp } = req.body;
    if (!barcode || !otp) return next(new ErrorResponse('Barcode and OTP are required', 400));

    const card = await Card.findOne({ barcode });
    if (!card) return next(new ErrorResponse('Card not found', 404));
    if (!card.owner || card.owner.toString() !== req.user.id) {
      return next(new ErrorResponse('You do not own this card', 403));
    }

    const user = await User.findById(req.user.id);
    if (!user.verifyOTP(otp)) {
      return next(new ErrorResponse('Invalid or expired OTP', 400));
    }

    // assign a simulated msisdn
    const newNumber = generateNewMsisdn(user.mobile);

    card.status = 'active';
    card.msisdn = newNumber;
    card.activatedAt = new Date();
    await card.save();
    await user.save(); // clear OTP etc.

    res.status(200).json({
      success: true,
      data: {
        barcode: card.barcode,
        msisdn: card.msisdn,
        status: card.status
      }
    });
  } catch (err) {
    next(err);
  }
};

function generateNewMsisdn(seedMobile) {
  const last4 = (seedMobile || '').slice(-4);
  const prefix = '9' + Math.floor(100000 + Math.random() * 900000).toString();
  return prefix + last4;
}
