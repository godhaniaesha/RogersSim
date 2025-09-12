  const mongoose = require('mongoose');

  const AddressSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      required: [true, 'Please add address type'],
      enum: ['home', 'office', 'other']
    },
    name: {
      type: String,
      required: [true, 'Please add contact name']
    },
    mobile: {
      type: String,
      required: [true, 'Please add mobile number'],
      match: [/^[0-9]{10}$/, 'Mobile number must be 10 digits']
    },
    addressLine1: {
      type: String,
      required: [true, 'Please add address line 1']
    },
    addressLine2: {
      type: String
    },
    city: {
      type: String,
      required: [true, 'Please add city']
    },
    state: {
      type: String,
      required: [true, 'Please add state']
    },
    pincode: {
      type: String,
      required: [true, 'Please add pincode'],
      match: [/^[0-9]{6}$/, 'Pincode must be 6 digits']
    },
    landmark: {
      type: String
    },
    isDefault: {
      type: Boolean,
      default: false
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
  AddressSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  // Ensure only one default address per user
  AddressSchema.pre('save', async function(next) {
    if (this.isDefault) {
      await this.constructor.updateMany(
        { user: this.user, _id: { $ne: this._id } },
        { isDefault: false }
      );
    }
    next();
  });

  module.exports = mongoose.model('Address', AddressSchema);
