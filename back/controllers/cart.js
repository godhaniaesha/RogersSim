const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Plan = require('../models/Plan');
const Addon = require('../models/Addon');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name image price')
      .populate('items.plan', 'name price validity')
      .populate('items.addons.addon', 'name price');

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
    const { productId, planId, addons = [], quantity = 1 } = req.body;

    // Validate required fields
    if (!productId || !planId) {
      return next(new ErrorResponse('Product and plan are required', 400));
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return next(new ErrorResponse('Product not found or inactive', 404));
    }

    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return next(new ErrorResponse('Plan not found or inactive', 404));
    }

    // Validate addons
    const addonIds = addons.map(addon => addon.addonId);
    if (addonIds.length > 0) {
      const validAddons = await Addon.find({
        _id: { $in: addonIds },
        plan: planId,
        isActive: true
      });
      
      if (validAddons.length !== addonIds.length) {
        return next(new ErrorResponse('Invalid addons for this plan', 400));
      }
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && 
              item.plan.toString() === planId
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].addons = addons.map(addon => ({
        addon: addon.addonId,
        quantity: addon.quantity || 1
      }));
    } else {
      // Add new item
      const addonTotal = addons.reduce((sum, addon) => {
        const addonPrice = validAddons.find(a => a._id.toString() === addon.addonId)?.price || 0;
        return sum + (addonPrice * (addon.quantity || 1));
      }, 0);

      const itemPrice = plan.price + addonTotal;
      const totalPrice = itemPrice * quantity;

      cart.items.push({
        product: productId,
        plan: planId,
        addons: addons.map(addon => ({
          addon: addon.addonId,
          quantity: addon.quantity || 1
        })),
        quantity,
        price: itemPrice,
        totalPrice
      });
    }

    await cart.save();

    // Populate the cart with full details
    await cart.populate([
      { path: 'items.product', select: 'name image price' },
      { path: 'items.plan', select: 'name price validity' },
      { path: 'items.addons.addon', select: 'name price' }
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
    const { quantity, addons } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return next(new ErrorResponse('Item not found in cart', 404));
    }

    // Update quantity
    if (quantity !== undefined) {
      cart.items[itemIndex].quantity = quantity;
    }

    // Update addons
    if (addons) {
      cart.items[itemIndex].addons = addons.map(addon => ({
        addon: addon.addonId,
        quantity: addon.quantity || 1
      }));
    }

    // Recalculate prices
    const item = cart.items[itemIndex];
    const plan = await Plan.findById(item.plan);
    const addonTotal = await Promise.all(
      item.addons.map(async (addonItem) => {
        const addon = await Addon.findById(addonItem.addon);
        return (addon?.price || 0) * addonItem.quantity;
      })
    );
    
    const totalAddonPrice = addonTotal.reduce((sum, price) => sum + price, 0);
    item.price = plan.price + totalAddonPrice;
    item.totalPrice = item.price * item.quantity;

    await cart.save();

    // Populate the cart with full details
    await cart.populate([
      { path: 'items.product', select: 'name image price' },
      { path: 'items.plan', select: 'name price validity' },
      { path: 'items.addons.addon', select: 'name price' }
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

    // Populate the cart with full details
    await cart.populate([
      { path: 'items.product', select: 'name image price' },
      { path: 'items.plan', select: 'name price validity' },
      { path: 'items.addons.addon', select: 'name price' }
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
    const cart = await Cart.findOne({ user: req.user.id });
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
