const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Plan = require('../models/Plan');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.productId', 'name image price')
      .populate('items.planId', 'name price validity');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, planId, quantity = 1 } = req.body;

    // At least one must be present
    if (!productId && !planId) {
      return next(new ErrorResponse('At least a product or plan is required', 400));
    }

    // Validate product if provided
    let product = null;
    if (productId) {
      product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return next(new ErrorResponse('Product not found or inactive', 404));
      }
    }

    // Validate plan if provided
    let plan = null;
    if (planId) {
      plan = await Plan.findById(planId);
      if (!plan || !plan.isActive) {
        return next(new ErrorResponse('Plan not found or inactive', 404));
      }
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // 🟢 NEW: disallow duplicate product or duplicate plan
    if (productId) {
      const alreadyHasProduct = cart.items.some(
        (item) => item.productId?.toString() === productId
      );
      if (alreadyHasProduct) {
        return next(new ErrorResponse('This product is already in your cart', 400));
      }
    }

    if (planId) {
      const alreadyHasPlan = cart.items.some(
        (item) => item.planId?.toString() === planId
      );
      if (alreadyHasPlan) {
        return next(new ErrorResponse('This plan is already in your cart', 400));
      }
    }

    // Compute price for this item
    const planPrice = plan ? plan.price : 0;
    const productPrice = product ? product.price : 0;
    const totalPrice = (planPrice + productPrice) * quantity;

    // Add new item (no merging because duplicates disallowed)
    cart.items.push({
      productId: productId || undefined,
      planId: planId || undefined,
      quantity,
      totalPrice
    });

    await cart.save();

    // Populate details
    await cart.populate([
      { path: 'items.productId', select: 'name image price' },
      { path: 'items.planId', select: 'name price validity' }
    ]);

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return next(new ErrorResponse('Item not found in cart', 404));
    }

    if (quantity !== undefined) {
      cart.items[itemIndex].quantity = quantity;

      // Recalculate price
      let planPrice = 0;
      let productPrice = 0;
      if (cart.items[itemIndex].planId) {
        const plan = await Plan.findById(cart.items[itemIndex].planId);
        planPrice = plan ? plan.price : 0;
      }
      if (cart.items[itemIndex].productId) {
        const product = await Product.findById(cart.items[itemIndex].productId);
        productPrice = product ? product.price : 0;
      }

      cart.items[itemIndex].totalPrice = (planPrice + productPrice) * quantity;
    }

    await cart.save();

    await cart.populate([
      { path: 'items.productId', select: 'name image price' },
      { path: 'items.planId', select: 'name price validity' }
    ]);

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    await cart.populate([
      { path: 'items.productId', select: 'name image price' },
      { path: 'items.planId', select: 'name price validity' }
    ]);

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    console.log('🛒 clearCart called ');
    
    const cart = await Cart.findOne({ user: req.user.id });
    console.log(cart,'cart');
    
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
};
