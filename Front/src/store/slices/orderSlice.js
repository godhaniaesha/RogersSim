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

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
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
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
