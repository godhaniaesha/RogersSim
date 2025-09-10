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
    
    // With new relation Product -> plans[], we fetch plan ids via products
    let planIdsFilter = undefined;
    if (productId || category) {
      const prodQuery = { isActive: true };
      if (productId) prodQuery._id = productId;
      if (category) prodQuery.category = category;
      const products = await Product.find(prodQuery).select('plans');
      const planIds = products.flatMap(p => (p.plans || []));
      planIdsFilter = planIds;
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
    
    if (planIdsFilter) {
      query._id = { $in: planIdsFilter };
    }

    const plans = await Plan.find(query)
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
    
    // Check if product exists and get its plans
    const product = await Product.findById(productId).select('plans');
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
      _id: { $in: product.plans || [] },
      isActive: true 
    })
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Plan.countDocuments({ _id: { $in: product.plans || [] }, isActive: true });
    
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
    const plan = await Plan.findById(req.params.id);
    
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


exports.createPlan = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      discount,
      validity,
      dataLimit,
      speed,
      features,
      isActive = true,
      isPopular = false,
      sortOrder = 0
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !validity || !dataLimit || !speed) {
      return next(
        new ErrorResponse(
          'Please provide name, description, price, validity, dataLimit, and speed',
          400
        )
      );
    }

    // Calculate discount if originalPrice is provided
    let calculatedDiscount = discount || 0;
    if (originalPrice && originalPrice > price) {
      calculatedDiscount = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    // Create plan
    const plan = await Plan.create({
      name,
      description,
      price,
      originalPrice: originalPrice || price,
      discount: calculatedDiscount,
      validity,
      dataLimit,
      speed,
      features: features || [],
      isActive,
      isPopular,
      sortOrder
    });

    res.status(201).json({
      success: true,
      data: plan
    });
  } catch (err) {
    next(err);
  }
};