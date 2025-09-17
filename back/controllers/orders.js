const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const ErrorResponse = require('../utils/errorResponse'); // optional custom error handler

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    let { checkout, shippingAddress, paymentId } = req.body;
    console.log(req.body,"================ create order ========================")
    const userId = req.user.id;

    // Trim spacesa
    checkout = checkout?.trim();
    shippingAddress = shippingAddress?.trim();

    const order = await Order.create({
      user: userId,
      checkout,
      shippingAddress,
      paymentId,
      status: "pending",
    });

    console.log(order, "================= New Order Created =================");

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};


// @desc    Get all orders (admin or user-specific)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('checkout shippingAddress payment');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('checkout shippingAddress');

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user checkout shippingAddress');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status or other fields
// @route   PUT /api/orders/:id
// @access  Private
exports.updateOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const { status, shippingAddress } = req.body;

    if (status) order.status = status;
    if (shippingAddress) order.shippingAddress = shippingAddress;

    order = await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    await order.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
