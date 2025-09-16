import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// POST /api/orders
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const err = await response.json();
        console.error("Order API error:", err);
        throw new Error(err.message || "Failed to create order");
      }

      const data = await response.json();
      return data.data.order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// (Optional) Add slice if not already present
const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;