const Payment = require('../models/Payment');
const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Process payment
// @route   POST /api/payments
// @access  Private
exports.processPayment = async (req, res, next) => {
  try {
    const { 
      orderId, 
      paymentMethod, 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature,
      emiDetails 
    } = req.body;

    // Get order
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to process payment for this order', 403));
    }

    // Generate payment ID
    const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      order: orderId,
      paymentId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      amount: order.total,
      method: paymentMethod,
      status: 'pending',
      emiDetails
    });

    // Update order payment status
    order.paymentStatus = 'pending';
    order.paymentId = paymentId;
    await order.save();

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
    const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // In a real application, you would verify the Razorpay signature here
    // For now, we'll simulate a successful verification
    
    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return next(new ErrorResponse('Payment not found', 404));
    }

    // Check if payment belongs to user
    if (payment.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to verify this payment', 403));
    }

    // Update payment status
    payment.status = 'success';
    payment.razorpayOrderId = razorpayOrderId;
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    // Update order status
    const order = await Order.findById(payment.order);
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();

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

    // EMI calculation parameters
    const interestRate = 12; // 12% annual interest rate
    const processingFee = 0.02; // 2% processing fee
    const processingFeeAmount = amount * processingFee;
    const principal = amount + processingFeeAmount;
    
    const monthlyRate = interestRate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);

    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    res.status(200).json({
      success: true,
      data: {
        principal: amount,
        processingFee: processingFeeAmount,
        totalPrincipal: principal,
        monthlyEmi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        tenure: months,
        interestRate: interestRate
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
    
    let query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('order', 'orderNumber total status')
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
      .populate('order', 'orderNumber total status items')
      .populate('user', 'name email mobile');

    if (!payment) {
      return next(new ErrorResponse('Payment not found', 404));
    }

    // Check if payment belongs to user
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

    // Check if payment belongs to user
    if (payment.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to refund this payment', 403));
    }

    // Check if payment is successful
    if (payment.status !== 'success') {
      return next(new ErrorResponse('Only successful payments can be refunded', 400));
    }

    const refundAmount = amount || payment.amount;
    const refundId = `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update payment record
    payment.refundAmount = refundAmount;
    payment.refundId = refundId;
    payment.refundStatus = 'pending';
    await payment.save();

    // Update order status
    const order = await Order.findById(payment.order);
    order.paymentStatus = 'refunded';
    order.status = 'refunded';
    order.notes = order.notes ? `${order.notes}\nRefund reason: ${reason}` : `Refund reason: ${reason}`;
    await order.save();

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
