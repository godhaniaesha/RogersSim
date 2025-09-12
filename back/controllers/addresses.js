const Address = require('../models/Address');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
exports.getUserAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user.id })
      .sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const addressData = {
      ...req.body,
      user: req.user.id
    };

    const address = await Address.create(addressData);

    res.status(201).json({
      success: true,
      data: address
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
exports.updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    let address = await Address.findById(id);
    if (!address) {
      return next(new ErrorResponse('Address not found', 404));
    }

    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this address', 403));
    }

    address = await Address.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const address = await Address.findById(id);
    if (!address) {
      return next(new ErrorResponse('Address not found', 404));
    }

    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this address', 403));
    }

    await Address.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Set default address
// @route   PUT /api/users/addresses/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const address = await Address.findById(id);
    if (!address) {
      return next(new ErrorResponse('Address not found', 404));
    }

    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this address', 403));
    }

    // Set this address as default (the pre-save hook will handle removing default from others)
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (err) {
    next(err);
  }
};
             