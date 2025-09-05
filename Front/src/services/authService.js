import api from './api';

export const authService = {
  // Login with email and password
  loginWithEmail: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Login with mobile OTP
  sendOtp: async (mobile) => {
    try {
      const response = await api.post('/auth/send-otp', { mobile });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send OTP' };
    }
  },

  verifyOtp: async (mobile, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { mobile, otp });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  },

  // Google login
  loginWithGoogle: async (tokenId) => {
    try {
      const response = await api.post('/auth/google', { tokenId });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Google login failed' };
    }
  },

  // Signup with email and password
  signupWithEmail: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user profile' };
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Upload KYC documents
  uploadKycDocuments: async (formData) => {
    try {
      const response = await api.post('/users/kyc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload KYC documents' };
    }
  },

  // Get KYC status
  getKycStatus: async () => {
    try {
      const response = await api.get('/users/kyc');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get KYC status' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;