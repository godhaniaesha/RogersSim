// Payment.js (UPDATED)
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  // Optional reference to a user if available in your app
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  // Phone number used for recharge/payment
  phone: {
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
    unique: true,
    required: true,
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
    of: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

PaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);
