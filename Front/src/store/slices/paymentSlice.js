import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const saveStripePayment = createAsyncThunk(
  "payment/saveStripePayment",
  async ({ userId, orderId, checkoutId, paymentIntent }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/api/payments/save-stripe-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, orderId, checkoutId, paymentIntent }),
      });
      if (!res.ok) throw new Error("Failed to save payment");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        payments: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveStripePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveStripePayment.fulfilled, (state, action) => {
                console.log(action.payload, "Payment saved");
                state.loading = false;
                state.payments.push(action.payload.data);
            })
            .addCase(saveStripePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default paymentSlice.reducer;
