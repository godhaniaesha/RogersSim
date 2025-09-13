// src/redux/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Base URL
const API_URL = "http://localhost:5000/api/cart"; // 👈 tamaru backend URL mukvo

// 🟢 Get Cart
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API_URL, {
        method: "GET", // if cookies used for auth
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      console.log("🛒 getCart response:", data);
      if (!res.ok) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🟢 Add to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (payload, { rejectWithValue }) => {

    console.log("🛒 addToCart payload:", payload); // { productId, planId, quantity }

    try {
      const token = localStorage.getItem("token"); // ✅ get token

      if (!token) {
        return rejectWithValue("No token found. Please log in again.");
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // { productId, planId, quantity }
      });
      const data = await res.json();
      console.log("🛒 addToCart response:", data);
      if (!res.ok) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🟢 Update Cart Item
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${itemId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      console.log("🛒 updateCartItem response:", data);
      if (!res.ok) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🟢 Remove Cart Item
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { rejectWithValue }) => {
    console.log("🛒 removeFromCart itemId:", itemId);
    try {
      const res = await fetch(`${API_URL}/${itemId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      console.log("🛒 removeFromCart response:", data);
      if (!res.ok) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🟢 Clear Cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      console.log("🛒 clearCart response:", data);
      if (!res.ok) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.tax = action.payload.tax || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.tax = action.payload.tax || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.tax = action.payload.tax || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Remove Item
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.tax = action.payload.tax || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.tax = action.payload.tax || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
