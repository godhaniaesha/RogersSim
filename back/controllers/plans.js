const Plan = require('../models/Plan');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
exports.getAllPlans = async (req, res, next) => {
  try {
    const { productId, category, sort, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by product
    if (productId) {
      query.product = productId;
    }
    
    // Filter by category through product
    if (category) {
      const products = await Product.find({ category, isActive: true }).select('_id');
      query.product = { $in: products.map(p => p._id) };
    }
    
    // Sort options
    let sortBy = {};
    if (sort) {
      switch (sort) {
        case 'price_low':
          sortBy = { price: 1 };
          break;
        case 'price_high':
          sortBy = { price: -1 };
          break;
        case 'popular':
          sortBy = { isPopular: -1, sortOrder: 1 };
          break;
        default:
          sortBy = { sortOrder: 1, price: 1 };
      }
    } else {
      sortBy = { sortOrder: 1, price: 1 };
    }
    
    const plans = await Plan.find(query)
      .populate('product', 'name category image')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Plan.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: plans.length,
      total,
      data: plans,
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

// @desc    Get plans by product ID
// @route   GET /api/plans/product/:productId
// @access  Public
exports.getPlansByProductId = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { sort, page = 1, limit = 10 } = req.query;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }
    
    // Sort options
    let sortBy = {};
    if (sort) {
      switch (sort) {
        case 'price_low':
          sortBy = { price: 1 };
          break;
        case 'price_high':
          sortBy = { price: -1 };
          break;
        case 'popular':
          sortBy = { isPopular: -1, sortOrder: 1 };
          break;
        default:
          sortBy = { sortOrder: 1, price: 1 };
      }
    } else {
      sortBy = { sortOrder: 1, price: 1 };
    }
    
    const plans = await Plan.find({ 
      product: productId, 
      isActive: true 
    })
      .populate('product', 'name category image')
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Plan.countDocuments({ product: productId, isActive: true });
    
    res.status(200).json({
      success: true,
      count: plans.length,
      total,
      data: plans,
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

// @desc    Get single plan
// @route   GET /api/plans/:id
// @access  Public
exports.getPlanById = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate('product', 'name category image description');
    
    if (!plan) {
      return next(new ErrorResponse('Plan not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (err) {
    next(err);
  }
};
