import api from './api';

export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product details' };
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products by category' };
    }
  },

  // Get all plans
  getAllPlans: async () => {
    try {
      const response = await api.get('/plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch plans' };
    }
  },

  // Get plans by product ID
  getPlansByProductId: async (productId) => {
    try {
      const response = await api.get(`/plans/product/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch plans for this product' };
    }
  },

  // Get all add-ons
  getAllAddons: async () => {
    try {
      const response = await api.get('/addons');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch add-ons' };
    }
  },

  // Get add-ons by plan ID
  getAddonsByPlanId: async (planId) => {
    try {
      const response = await api.get(`/addons/plan/${planId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch add-ons for this plan' };
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const response = await api.get(`/products/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Search failed' };
    }
  },

  // Filter products
  filterProducts: async (filters) => {
    try {
      const response = await api.post('/products/filter', filters);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to filter products' };
    }
  },
};

export default productService;