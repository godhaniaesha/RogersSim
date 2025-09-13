const mongoose = require('mongoose');

/* ────────── Each item ────────── */
const CheckoutItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  planId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Plan'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

/* ────────── Each EMI payment record ────────── */
const EmiPaymentSchema = new mongoose.Schema({
  monthNumber: { type: Number, required: true },
  amountPaid: { type: Number, required: true, min: 0 },
  paidAt: { type: Date, default: Date.now }
});

/* ────────── Checkout Schema ────────── */
const CheckoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },

  items: [CheckoutItemSchema],

  subtotal: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },

  // Payment / shipping info
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'cod', 'emi', 'full'],
    required: true
  },

  /** New fields for EMI **/
  emiMonths: {
    type: Number,
    enum: [3, 6, 9, 12],
    required: function () {
      return this.paymentMethod === 'emi';
    }
  },
  upfrontPayment: {
    type: Number,
    min: 0
  },
  remainingAmount: {
    type: Number,
    min: 0
  },
  emiPerMonth: {
    type: Number,
    min: 0
  },

  // track each monthly payment:
  emiPayments: [EmiPaymentSchema],

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  shippingAddress: {
    type: mongoose.Schema.ObjectId,
    ref: 'Address',
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// auto-update updatedAt
CheckoutSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Checkout', CheckoutSchema);
