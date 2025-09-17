// Payment.js (UPDATED)
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  // Optional reference to a user if available in your app
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  checkout: {
    type: mongoose.Schema.ObjectId,
    ref: 'Checkout',
  },
  paymentId: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: false,
  },
  // The plan being purchased
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: false,
  },
  // Amount in rupees for easy reporting (Stripe returns paise; we convert)
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  // Stripe identifiers
stripeSessionId: {
  type: String,
  required: false,
  index: true, // keep it searchable, but not unique
},
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  method: {
    type: String,
    enum: ['cod', 'card', 'netbanking', 'upi', 'wallet', 'emi']
  },
  stripePaymentIntentId: {
    type: String,
  },
  // Payment status lifecycle
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled', 'refunded'],
    default: 'pending',
  },
  // Raw gateway response (optional)
  gatewayResponse: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  refundAmount: { type: Number, default: 0, min: 0 },
  refundId: String,
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'success', 'failed'],
    default: 'none'
  },
  emiDetails: {
    tenure: Number,
    monthlyAmount: Number,
    interestRate: Number,
    processingFee: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PaymentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);
