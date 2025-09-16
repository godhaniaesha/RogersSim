// Payment.js (UPDATED)
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
    // not required if you might accept guest payments; but recommended to provide userId
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order'
    // made optional for Stripe payments without an "Order" entity
  },
  paymentId: {
    type: String,
    required: true,
    unique: true // keep unique to avoid duplicates
  },
  // Stripe-specific fields
  stripePaymentIntentId: { type: String },
  stripeChargeId: { type: String },
  receiptUrl: { type: String },

  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  method: {
    type: String,
    enum: ['cod', 'card', 'netbanking', 'upi', 'wallet', 'emi', 'stripe'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed // store raw gateway response
  },
  phone: {
    type: String
  },
  planId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Plan'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

PaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);
