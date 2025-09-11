const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a plan name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
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
  planType: {
    type: String,
    required: [true, 'Please add a type'],
    enum: ['mobile', 'fiber']
  },
  validity: {
    type: String,
    required: [true, 'Please add validity period'],
    enum: ['1_day', '1_month', '3_months', '6_months', '1_year', '2_years', 'lifetime']
  },
  dataLimit: {
    type: String,
    required: [true, 'Please add data limit'],
    enum: ['unlimited', '1GB', '1.5GB', '2GB', '2.5GB', '3GB', '5GB', '10GB', '20GB', '50GB', '100GB', '200GB', '500GB', '1TB']
  },
  speed: {
    type: String,
    required: [true, 'Please add speed'],
    enum: ['unlimited', '1Mbps', '2Mbps', '5Mbps', '10Mbps', '20Mbps', '50Mbps', '100Mbps', '200Mbps', '500Mbps', '1Gbps']
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
PlanSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Plan', PlanSchema);
