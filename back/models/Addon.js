const mongoose = require('mongoose');

const AddonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an addon name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: 'Plan',
    required: [true, 'Please add a plan reference']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  validity: {
    type: String,
    required: [true, 'Please add validity period'],
    enum: ['1_month', '3_months', '6_months', '1_year', '2_years', 'lifetime']
  },
  features: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
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

// Update the updatedAt field before saving
AddonSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Addon', AddonSchema);
