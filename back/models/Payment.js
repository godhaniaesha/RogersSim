const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  checkout: {
    type: mongoose.Schema.ObjectId,
    ref: 'Checkout',
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
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
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
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
