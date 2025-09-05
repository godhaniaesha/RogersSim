import api from './api';

export const cartService = {
  // Get cart items
  getCartItems: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch cart items' };
    }
  },

  // Add item to cart
  addToCart: async (item) => {
    try {
      const response = await api.post('/cart', item);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add item to cart' };
    }
  },

  // Update cart item quantity
  updateQuantity: async (id, quantity) => {
    try {
      const response = await api.put(`/cart/${id}`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update quantity' };
    }
  },

  // Remove item from cart
  removeFromCart: async (id) => {
    try {
      const response = await api.delete(`/cart/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove item from cart' };
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to clear cart' };
    }
  },

  // Get user addresses
  getUserAddresses: async () => {
    try {
      const response = await api.get('/users/addresses');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch addresses' };
    }
  },

  // Add new address
  addAddress: async (address) => {
    try {
      const response = await api.post('/users/addresses', address);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add address' };
    }
  },

  // Update address
  updateAddress: async (id, address) => {
    try {
      const response = await api.put(`/users/addresses/${id}`, address);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update address' };
    }
  },

  // Delete address
  deleteAddress: async (id) => {
    try {
      const response = await api.delete(`/users/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete address' };
    }
  },

  // Create order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create order' };
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order details' };
    }
  },

  // Get user orders
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Process payment
  processPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Payment processing failed' };
    }
  },

  // Calculate EMI
  calculateEmi: async (amount, months) => {
    try {
      const response = await api.post('/payments/calculate-emi', { amount, months });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to calculate EMI' };
    }
  },

  // Generate invoice
  generateInvoice: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate invoice' };
    }
  },

  // Update delivery slot
  updateDeliverySlot: async (orderId, slotData) => {
    try {
      const response = await api.put(`/orders/${orderId}/delivery-slot`, slotData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update delivery slot' };
    }
  },
};

export default cartService;