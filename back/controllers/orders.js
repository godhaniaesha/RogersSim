const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { 
      shippingAddressId, 
      billingAddressId, 
      paymentMethod, 
      notes,
      deliverySlot 
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price')
      .populate('items.plan', 'name price')
      .populate('items.addons.addon', 'name price');

    if (!cart || cart.items.length === 0) {
      return next(new ErrorResponse('Cart is empty', 400));
    }

    // Validate addresses
    const shippingAddress = await Address.findById(shippingAddressId);
    if (!shippingAddress || shippingAddress.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Invalid shipping address', 400));
    }

    const billingAddress = await Address.findById(billingAddressId);
    if (!billingAddress || billingAddress.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Invalid billing address', 400));
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: cart.items.map(item => ({
        product: item.product._id,
        plan: item.plan._id,
        addons: item.addons,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice
      })),
      shippingAddress: shippingAddressId,
      billingAddress: billingAddressId,
      subtotal: cart.subtotal,
      tax: cart.tax,
      total: cart.total,
      paymentMethod,
      notes,
      deliverySlot
    });

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    // Populate order details
    await order.populate([
      { path: 'items.product', select: 'name image' },
      { path: 'items.plan', select: 'name price validity' },
      { path: 'items.addons.addon', select: 'name price' },
      { path: 'shippingAddress' },
      { path: 'billingAddress' }
    ]);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/user
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name image')
      .populate('items.plan', 'name price validity')
      .populate('items.addons.addon', 'name price')
      .populate('shippingAddress')
      .populate('billingAddress')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      data: orders,
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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name image price')
      .populate('items.plan', 'name price validity features')
      .populate('items.addons.addon', 'name price')
      .populate('shippingAddress')
      .populate('billingAddress');

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to view this order', 403));
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this order', 403));
    }

    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update delivery slot
// @route   PUT /api/orders/:id/delivery-slot
// @access  Private
exports.updateDeliverySlot = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, timeSlot } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this order', 403));
    }

    order.deliverySlot = { date, timeSlot };
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to cancel this order', 403));
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return next(new ErrorResponse('Order cannot be cancelled', 400));
    }

    order.status = 'cancelled';
    order.notes = order.notes ? `${order.notes}\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`;
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate invoice
// @route   GET /api/orders/:id/invoice
// @access  Private
exports.generateInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price')
      .populate('items.plan', 'name price validity')
      .populate('items.addons.addon', 'name price')
      .populate('shippingAddress')
      .populate('billingAddress')
      .populate('user', 'name email mobile');

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if order belongs to user
    if (order.user._id.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to view this invoice', 403));
    }

    // In a real application, you would generate a PDF invoice here
    // For now, we'll return the order data as JSON
    res.status(200).json({
      success: true,
      data: {
        order,
        invoice: {
          invoiceNumber: `INV-${order.orderNumber}`,
          generatedAt: new Date(),
          // Add more invoice-specific data here
        }
      }
    });
  } catch (err) {
    next(err);
  }
};
