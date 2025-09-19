const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('Email already registered', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Send OTP for mobile verification
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return next(new ErrorResponse('Please provide a mobile number', 400));
    }

    // Find user by mobile or create a new one
    let user = await User.findOne({ mobile });
    
    if (!user) {
      // For signup flow, create a temporary user
      user = new User({
        name: 'Temporary User',
        email: `temp_${Date.now()}@example.com`,
        mobile,
        password: Math.random().toString(36).slice(-8) // Random password
      });
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // In a real app, send OTP via SMS using Twilio
    // For now, we'll just return it in the response (for testing)
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: process.env.NODE_ENV === 'development' ? { otp } : {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify OTP and login/signup user
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return next(new ErrorResponse('Please provide mobile number and OTP', 400));
    }

    // Find user by mobile
    const user = await User.findOne({ mobile });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Verify OTP
    const isValid = user.verifyOTP(otp);

    if (!isValid) {
      return next(new ErrorResponse('Invalid or expired OTP', 400));
    }

    // Save user to clear OTP
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login/Register with Google
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res, next) => {
  try {
    const { tokenId } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email_verified, name, email, picture } = ticket.getPayload();

    if (!email_verified) {
      return next(new ErrorResponse('Google email not verified', 400));
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId: ticket.getUserId(),
        password: Math.random().toString(36).slice(-8) // Random password
      });
    } else {
      // Update Google ID if not already set
      if (!user.googleId) {
        user.googleId = ticket.getUserId();
        await user.save();
      }
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
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

// @desc    Forgot password - Send OTP to mobile
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    

    if (!mobile) {
      return next(new ErrorResponse('Please provide a mobile number', 400));
    }

    // Find user by mobile
    const user = await User.findOne({ mobile });

    if (!user) {
      return next(new ErrorResponse('No user found with this mobile number', 404));
    }

    // Generate OTP for password reset
    const otp = user.generateOTP();

    console.log(otp,"otp");
    
    await user.save();

    // In a real app, send OTP via SMS using Twilio
    // For now, we'll just return it in the response (for testing)
    res.status(200).json({
      success: true,
      message: 'OTP sent to your mobile number for password reset',
      data: process.env.NODE_ENV === 'development' ? { otp } : {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify OTP for password reset
// @route   POST /api/auth/verify-reset-otp
// @access  Public
exports.verifyResetOtp = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return next(new ErrorResponse('Please provide mobile number and OTP', 400));
    }

    // Find user by mobile
    const user = await User.findOne({ mobile });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Verify OTP
    const isValid = user.verifyOTP(otp);

    if (!isValid) {
      return next(new ErrorResponse('Invalid or expired OTP', 400));
    }

    // Generate reset password token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        resetToken,
        mobile: user.mobile
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const {  newPassword, confirmPassword } = req.body;

    if ( !newPassword || !confirmPassword) {
      return next(new ErrorResponse('Please provide all required fields', 400));
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return next(new ErrorResponse('Passwords do not match', 400));
    }

    // Find user by mobile and reset token
    const user = await User.findOne({
      // resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired reset token', 400));
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  });
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });
};