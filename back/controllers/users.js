const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address,
      pincode: req.body.pincode
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] === undefined) {
        delete fieldsToUpdate[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload KYC documents
// @route   POST /api/users/kyc
// @access  Private
exports.uploadKyc = async (req, res, next) => {
  try {
    const kycDocuments = {
      idProof: req.body.idProof || 'id_proof_url',
      addressProof: req.body.addressProof || 'address_proof_url',
      photo: req.body.photo || 'photo_url'
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        kycDocuments,
        kycStatus: 'pending'
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};
// @desc    Get KYC status
// @route   GET /api/users/kyc
// @access  Private
exports.getKycStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        kycStatus: user.kycStatus,
        kycDocuments: user.kycDocuments
      }
    });
  } catch (err) {
    next(err);
  }
};