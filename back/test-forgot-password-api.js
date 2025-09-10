// Test file for Forgot Password and Product APIs
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testMobile = '9876543210';
const testOtp = '123456'; // This will be returned in development mode
const testResetToken = 'test-reset-token-123';
const testNewPassword = 'newpassword123';
const testConfirmPassword = 'newpassword123';

// Test forgot password API
async function testForgotPassword() {
  try {
    console.log('Testing Forgot Password API...');
    const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
      mobile: testMobile
    });
    console.log('Forgot Password Response:', response.data);
  } catch (error) {
    console.error('Forgot Password Error:', error.response?.data || error.message);
  }
}

// Test verify reset OTP API
async function testVerifyResetOtp() {
  try {
    console.log('Testing Verify Reset OTP API...');
    const response = await axios.post(`${BASE_URL}/auth/verify-reset-otp`, {
      mobile: testMobile,
      otp: testOtp
    });
    console.log('Verify Reset OTP Response:', response.data);
  } catch (error) {
    console.error('Verify Reset OTP Error:', error.response?.data || error.message);
  }
}

// Test reset password API
async function testResetPassword() {
  try {
    console.log('Testing Reset Password API...');
    const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
      mobile: testMobile,
      resetToken: testResetToken,
      newPassword: testNewPassword,
      confirmPassword: testConfirmPassword
    });
    console.log('Reset Password Response:', response.data);
  } catch (error) {
    console.error('Reset Password Error:', error.response?.data || error.message);
  }
}

// Test create product API (requires admin token)
async function testCreateProduct() {
  try {
    console.log('Testing Create Product API...');
    const response = await axios.post(`${BASE_URL}/products`, {
      name: 'Test Mobile Plan',
      description: 'Unlimited calls and 1GB data per day',
      category: 'mobile',
      price: 299,
      originalPrice: 399,
      features: ['Unlimited calls', '1GB data per day', 'SMS pack'],
      tags: ['popular', 'best-seller'],
      stock: 100
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE'
      }
    });
    console.log('Create Product Response:', response.data);
  } catch (error) {
    console.error('Create Product Error:', error.response?.data || error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('=== Testing Forgot Password and Product APIs ===\n');
  
  await testForgotPassword();
  console.log('\n---\n');
  
  await testVerifyResetOtp();
  console.log('\n---\n');
  
  await testResetPassword();
  console.log('\n---\n');
  
  await testCreateProduct();
  console.log('\n=== Tests Complete ===');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testForgotPassword,
  testVerifyResetOtp,
  testResetPassword,
  testCreateProduct
};
