const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse'); // optional if you’re using a custom error handler

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { checkout, shippingAddress } = req.body; // user comes from req.user if you use auth middleware

    // Create a new order
    const order = await Order.create({
      user: req.user.id, // assuming user is attached to req
      checkout,
      shippingAddress,
    });

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
    // If you want user-specific orders:
    // const orders = await Order.find({ user: req.user.id }).populate('checkout shippingAddress');
    const orders = await Order.find().populate('user checkout shippingAddress');

    res.status(200).json({ success: true, count: orders.length, data: orders });
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

    // Only update allowed fields (status, shippingAddress, etc.)
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
