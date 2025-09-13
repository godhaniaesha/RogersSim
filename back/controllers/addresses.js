const Address = require('../models/Address');

// 📌 Add new address for a user (user ID from token)
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user._id;  // ✅ from token
    console.log(userId,'user');
    
    const { fullName, mobileNumber, address, city, state, pincode } = req.body;

    let userAddress = await Address.findOne({ user: userId });

    if (!userAddress) {
      userAddress = new Address({
        user: userId,
        addresses: [{ fullName, mobileNumber, address, city, state, pincode }]
      });
    } else {
      userAddress.addresses.push({ fullName, mobileNumber, address, city, state, pincode });
    }

    await userAddress.save();
    res.status(201).json({ success: true, data: userAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Get all addresses for a user (user ID from token)
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;  // ✅ from token
    const userAddress = await Address.findOne({ user: userId }).populate('user');

    if (!userAddress) {
      return res.status(404).json({ success: false, message: 'No addresses found for this user' });
    }

    res.status(200).json({ success: true, data: userAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Edit a specific address by index
exports.editAddress = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ from token
    const { addressIndex } = req.params;
    const { fullName, mobileNumber, address, city, state, pincode } = req.body;

    const userAddress = await Address.findOne({ user: userId });
    if (!userAddress) return res.status(404).json({ success: false, message: 'User not found' });

    if (!userAddress.addresses[addressIndex]) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    userAddress.addresses[addressIndex] = { fullName, mobileNumber, address, city, state, pincode };

    await userAddress.save();
    res.status(200).json({ success: true, data: userAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Delete a specific address by index
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ from token
    const { addressIndex } = req.params;

    const userAddress = await Address.findOne({ user: userId });
    if (!userAddress) return res.status(404).json({ success: false, message: 'User not found' });

    if (!userAddress.addresses[addressIndex]) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    userAddress.addresses.splice(addressIndex, 1);

    await userAddress.save();
    res.status(200).json({ success: true, data: userAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
             