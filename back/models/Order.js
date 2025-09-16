const mongoose = require('mongoose');

// Main order schema
const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },

  checkout: {
    type: mongoose.Schema.ObjectId,
    ref: 'Checkout',
    required: true
  },

orderNumber: { type: String, unique: true },
barcode: { type: String, unique: true },
newNumber: { type: String, unique: true },

  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },


  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
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
OrderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Generate order number, barcode & newNumber before saving
OrderSchema.pre('save', async function (next) {
  // 👇 order number
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
  }

  // 👇 generate an 8-digit barcode if not present
  if (!this.barcode) {
    let uniqueBarcode = false;
    let barcode;
    while (!uniqueBarcode) {
      barcode = Math.floor(10000000 + Math.random() * 90000000).toString(); // 8 digits
      const exists = await this.constructor.findOne({ barcode });
      if (!exists) uniqueBarcode = true;
    }
    this.barcode = barcode;
  }

  // 👇 generate a 10-digit newNumber if not present
  if (!this.newNumber) {
    let uniqueNewNumber = false;
    let newNumber;
    while (!uniqueNewNumber) {
      newNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10 digits
      const exists = await this.constructor.findOne({ newNumber });
      if (!exists) uniqueNewNumber = true;
    }
    this.newNumber = newNumber;
  }

  next();
});

module.exports = mongoose.model('Order', OrderSchema);
