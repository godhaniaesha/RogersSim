const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  // user must supply barcode when creating card
  barcode: {
    type: String,
    required: [true, 'Please provide a card barcode'],
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['unassigned', 'sold', 'active'],
    default: 'unassigned'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  msisdn: {
    type: String,
    trim: true
  },
  activatedAt: {
    type: Date
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

// just update updatedAt on every save
CardSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Card', CardSchema);
