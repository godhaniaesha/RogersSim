const Payment = require('../models/Payment');
const Checkout = require('../models/Checkout'); // previously 'Order'
const ErrorResponse = require('../utils/errorResponse');

// @desc    Process payment
// @route   POST /api/payments
// @access  Private
exports.processPayment = async (req, res, next) => {
  try {
    const { 
      checkoutId, 
      paymentMethod, 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature,
      emiDetails 
    } = req.body;

    // Get checkout
    const checkout = await Checkout.findById(checkoutId);
    if (!checkout) {
      return next(new ErrorResponse('Checkout not found', 404));
    }

    // Check if checkout belongs to user
    if (checkout.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to process payment for this checkout', 403));
    }

    // Generate unique payment ID
    const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create payment
    const payment = await Payment.create({
      user: req.user.id,
      checkout: checkoutId,
      paymentId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      amount: checkout.total,
      method: paymentMethod,
      status: 'pending',
      currency: 'INR',
      emiDetails
    });

    // Update checkout payment status
    checkout.paymentStatus = 'pending';
    checkout.paymentId = paymentId;
    await checkout.save();

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature, gatewayResponse } = req.body;

    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return next(new ErrorResponse('Payment not found', 404));
    }

    if (payment.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to verify this payment', 403));
    }

    // Update payment
    payment.status = 'success';
    payment.razorpayOrderId = razorpayOrderId;
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    if (gatewayResponse) {
      payment.gatewayResponse = gatewayResponse;
    }
    await payment.save();

    // Update checkout
    const checkout = await Checkout.findById(payment.checkout);
    checkout.paymentStatus = 'paid';
    checkout.status = 'confirmed';
    await checkout.save();

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Calculate EMI
// @route   POST /api/payments/calculate-emi
// @access  Public
exports.calculateEmi = async (req, res, next) => {
  try {
    const { amount, months } = req.body;

    if (!amount || !months) {
      return next(new ErrorResponse('Amount and months are required', 400));
    }

    const interestRate = 12;
    const processingFeeRate = 0.02;
    const processingFee = amount * processingFeeRate;
    const principal = amount + processingFee;

    const monthlyRate = interestRate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);

    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    res.status(200).json({
      success: true,
      data: {
        principal: amount,
        processingFee,
        totalPrincipal: principal,
        monthlyEmi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        tenure: months,
        interestRate
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get payment history
// @route   GET /api/payments
// @access  Private
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('checkout', 'orderNumber total status')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      data: payments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('checkout', 'orderNumber total status items')
      .populate('user', 'name email mobile');

    if (!payment) {
      return next(new ErrorResponse('Payment not found', 404));
    }

    if (payment.user._id.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to view this payment', 403));
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Initiate refund
// @route   POST /api/payments/:id/refund
// @access  Private
exports.initiateRefund = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return next(new ErrorResponse('Payment not found', 404));
    }

    if (payment.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to refund this payment', 403));
    }

    if (payment.status !== 'success') {
      return next(new ErrorResponse('Only successful payments can be refunded', 400));
    }

    const refundAmount = amount || payment.amount;
    const refundId = `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    payment.refundAmount = refundAmount;
    payment.refundId = refundId;
    payment.refundStatus = 'pending';
    payment.status = 'refunded';
    await payment.save();

    const checkout = await Checkout.findById(payment.checkout);
    checkout.paymentStatus = 'refunded';
    checkout.status = 'refunded';
    checkout.notes = checkout.notes ? `${checkout.notes}\nRefund reason: ${reason}` : `Refund reason: ${reason}`;
    await checkout.save();

    res.status(200).json({
      success: true,
      data: {
        refundId,
        refundAmount,
        status: 'pending',
        message: 'Refund initiated successfully'
      }
    });
  } catch (err) {
    next(err);
  }
};
