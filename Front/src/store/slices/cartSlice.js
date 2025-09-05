import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk for fetching cart items
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call when backend is ready
      // For now, we'll just return the cart items from localStorage or an empty array
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      return cartItems;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for adding item to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartItem, { dispatch, rejectWithValue }) => {
    try {
      dispatch(addToCartStart());
      // In a real app, this would be an API call
      // For now, we'll just add to localStorage
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === cartItem.id && item.planId === cartItem.planId
      );

      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += 1;
      } else {
        cartItems.push({ ...cartItem, quantity: 1 });
      }
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      dispatch(addToCartSuccess(cartItem));
      return cartItem;
    } catch (error) {
      dispatch(addToCartFailure(error.message));
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === newItem.id && item.planId === newItem.planId
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }
      
      state.loading = false;
    },
    addToCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => 
        !(item.id === action.payload.id && item.planId === action.payload.planId)
      );
    },
    updateQuantity: (state, action) => {
      const { id, planId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        item => item.id === id && item.planId === planId
      );
      
      if (itemIndex >= 0) {
        if (quantity > 0) {
          state.items[itemIndex].quantity = quantity;
        } else {
          state.items.splice(itemIndex, 1);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  removeFromCart,
  updateQuantity,
  clearCart,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;