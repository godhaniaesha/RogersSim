const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test function to check if server is running
const testServer = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log('✅ Server is running:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Server is not running:', error.message);
    return false;
  }
};

// Test function for public endpoints
const testPublicEndpoints = async () => {
  try {
    console.log('\n🧪 Testing public endpoints...\n');

    // Test products endpoint
    try {
      const productsResponse = await axios.get(`${API_BASE_URL}/products`);
      console.log('✅ Products endpoint:', productsResponse.data.count, 'products found');
    } catch (error) {
      console.log('❌ Products endpoint failed:', error.response?.data?.message || error.message);
    }

    // Test plans endpoint
    try {
      const plansResponse = await axios.get(`${API_BASE_URL}/plans`);
      console.log('✅ Plans endpoint:', plansResponse.data.count, 'plans found');
    } catch (error) {
      console.log('❌ Plans endpoint failed:', error.response?.data?.message || error.message);
    }

    // Test addons endpoint
    try {
      const addonsResponse = await axios.get(`${API_BASE_URL}/addons`);
      console.log('✅ Addons endpoint:', addonsResponse.data.count, 'addons found');
    } catch (error) {
      console.log('❌ Addons endpoint failed:', error.response?.data?.message || error.message);
    }

    // Test EMI calculation
    try {
      const emiResponse = await axios.post(`${API_BASE_URL}/payments/calculate-emi`, {
        amount: 10000,
        months: 12
      });
      console.log('✅ EMI calculation:', emiResponse.data.data.monthlyEmi, 'per month');
    } catch (error) {
      console.log('❌ EMI calculation failed:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.log('❌ Error testing public endpoints:', error.message);
  }
};

// Test function for authentication
const testAuth = async () => {
  try {
    console.log('\n🔐 Testing authentication...\n');

    // Test signup
    try {
      const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, {
        name: 'Test User',
        email: 'test@example.com',
        mobile: '9876543210',
        password: 'password123'
      });
      console.log('✅ Signup successful:', signupResponse.data.user.name);
      
      // Store token for further tests
      const token = signupResponse.data.token;
      
      // Test protected endpoint
      try {
        const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Profile access successful:', profileResponse.data.data.name);
      } catch (error) {
        console.log('❌ Profile access failed:', error.response?.data?.message || error.message);
      }

    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already registered')) {
        console.log('ℹ️  User already exists, testing login instead...');
        
        // Test login
        try {
          const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'test@example.com',
            password: 'password123'
          });
          console.log('✅ Login successful:', loginResponse.data.user.name);
        } catch (loginError) {
          console.log('❌ Login failed:', loginError.response?.data?.message || loginError.message);
        }
      } else {
        console.log('❌ Signup failed:', error.response?.data?.message || error.message);
      }
    }

  } catch (error) {
    console.log('❌ Error testing authentication:', error.message);
  }
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting API tests...\n');
  
  const serverRunning = await testServer();
  if (!serverRunning) {
    console.log('\n❌ Cannot run tests - server is not running');
    console.log('Please start the server with: npm run dev');
    return;
  }

  await testPublicEndpoints();
  await testAuth();
  
  console.log('\n✨ API tests completed!');
  console.log('\n📝 Note: Some tests may fail if the database is empty.');
  console.log('Run "npm run seed" to populate sample data.');
};

// Run tests
runTests().catch(console.error);
