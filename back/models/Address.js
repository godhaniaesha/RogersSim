const mongoose = require('mongoose');
 
// Sub-schema for single address
const SingleAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add full name']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please add mobile number'],
    match: [/^[0-9]{10}$/, 'Mobile number must be 10 digits']
  },
  address: {
    type: String,
    required: [true, 'Please add address']
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
  }
}, { _id: false }); // avoid extra _id inside address array
 
// Main schema
const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  addresses: [SingleAddressSchema]
}, { timestamps: true });
 
module.exports = mongoose.model('Address', AddressSchema);
