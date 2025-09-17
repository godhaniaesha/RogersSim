import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 🔹 Async thunk: my orders fetch
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/orders/my', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      if (!res.ok) {
        // serverએ success:false return કર્યુ હોય તો reject
        return rejectWithValue(data.error || 'Something went wrong');
      }
      return data.data; // orders array
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...orderData,
          checkout: orderData.checkout?.trim(),
          shippingAddress: orderData.shippingAddress?.trim(),
        }),
      });

      const data = await response.json(); // ✅ read once

      if (!response.ok) {
        console.error("Order API error:", data);
        return rejectWithValue(data.error || data.message || "Failed to create order");
      }

      console.log("Order Created Successfully", data);
      return data.data; // backend returns { success: true, data: order }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// (Optional) Add slice if not already present
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        console.log('====================================');
        console.log(action.payload);
        console.log('====================================');
        state.loading = false;
        state.orders = action.payload; // orders array
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default orderSlice.reducer;
