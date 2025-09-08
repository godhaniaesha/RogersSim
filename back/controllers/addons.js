const Addon = require('../models/Addon');
const Plan = require('../models/Plan');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all addons
// @route   GET /api/addons
// @access  Public
exports.getAllAddons = async (req, res, next) => {
  try {
    const { planId, sort, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by plan
    if (planId) {
      query.plan = planId;
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
    
    const addons = await Addon.find(query)
      .populate('plan', 'name product')
      .populate({
        path: 'plan',
        populate: {
          path: 'product',
          select: 'name category'
        }
      })
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Addon.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: addons.length,
      total,
      data: addons,
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

// @desc    Get addons by plan ID
// @route   GET /api/addons/plan/:planId
// @access  Public
exports.getAddonsByPlanId = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { sort, page = 1, limit = 10 } = req.query;
    
    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return next(new ErrorResponse('Plan not found', 404));
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
    
    const addons = await Addon.find({ 
      plan: planId, 
      isActive: true 
    })
      .populate('plan', 'name product')
      .populate({
        path: 'plan',
        populate: {
          path: 'product',
          select: 'name category'
        }
      })
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Addon.countDocuments({ plan: planId, isActive: true });
    
    res.status(200).json({
      success: true,
      count: addons.length,
      total,
      data: addons,
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

// @desc    Get single addon
// @route   GET /api/addons/:id
// @access  Public
exports.getAddonById = async (req, res, next) => {
  try {
    const addon = await Addon.findById(req.params.id)
      .populate('plan', 'name product')
      .populate({
        path: 'plan',
        populate: {
          path: 'product',
          select: 'name category'
        }
      });
    
    if (!addon) {
      return next(new ErrorResponse('Addon not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: addon
    });
  } catch (err) {
    next(err);
  }
};
