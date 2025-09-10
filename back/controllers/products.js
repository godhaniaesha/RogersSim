const Product = require('../models/Product');
const Plan = require('../models/Plan');
const Addon = require('../models/Addon');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, search, sort, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
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
          sortBy = { isPopular: -1, rating: -1 };
          break;
        case 'newest':
          sortBy = { createdAt: -1 };
          break;
        case 'rating':
          sortBy = { rating: -1 };
          break;
        default:
          sortBy = { createdAt: -1 };
      }
    } else {
      sortBy = { createdAt: -1 };
    }
    
    const products = await Product.find(query)
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      data: products,
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('plans');
    
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10, sort } = req.query;
    
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
          sortBy = { isPopular: -1, rating: -1 };
          break;
        case 'rating':
          sortBy = { rating: -1 };
          break;
        default:
          sortBy = { createdAt: -1 };
      }
    } else {
      sortBy = { createdAt: -1 };
    }
    
    const products = await Product.find({ 
      category, 
      isActive: true 
    })
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments({ category, isActive: true });
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      data: products,
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

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return next(new ErrorResponse('Please provide a search query', 400));
    }
    
    const query = {
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };
    
    const products = await Product.find(query)
      .sort({ isPopular: -1, rating: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      data: products,
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

// @desc    Filter products
// @route   POST /api/products/filter
// @access  Public
exports.filterProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      features, 
      tags, 
      page = 1, 
      limit = 10, 
      sort 
    } = req.body;
    
    let query = { isActive: true };
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }
    
    // Features filter
    if (features && features.length > 0) {
      query.features = { $in: features };
    }
    
    // Tags filter
    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
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
          sortBy = { isPopular: -1, rating: -1 };
          break;
        case 'rating':
          sortBy = { rating: -1 };
          break;
        default:
          sortBy = { createdAt: -1 };
      }
    } else {
      sortBy = { createdAt: -1 };
    }
    
    const products = await Product.find(query)
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      data: products,
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


// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only)
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      image,
      images,
      price,
      originalPrice,
      discount,
      features,
      specifications,
      isActive = true,
      isPopular = false,
      tags,
      plans,
      stock = 0
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !price) {
      return next(new ErrorResponse('Please provide name, description, category, and price', 400));
    }

    // Validate category
    const validCategories = ['prepaid', 'esim', 'postpaid', 'data', 'travel' , 'other'];
    if (!validCategories.includes(category)) {
      return next(new ErrorResponse('Invalid category. Must be one of: ' + validCategories.join(', '), 400));
    }

    // Calculate discount if originalPrice is provided
    let calculatedDiscount = discount || 0;
    if (originalPrice && originalPrice > price) {
      calculatedDiscount = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    const product = await Product.create({
      name,
      description,
      category,
      image: image || 'no-image.jpg',
      images: images || [],
      price,
      originalPrice: originalPrice || price,
      discount: calculatedDiscount,
      features: features || [],
      specifications: specifications || {},
      isActive,
      isPopular,
      tags: tags || [],
      plans: plans || [],
      stock
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};