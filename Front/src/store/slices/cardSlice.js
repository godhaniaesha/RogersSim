// src/store/slices/cardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Base URL
const API_URL = "http://localhost:5000/api/cards"; // 👈 tamaru backend URL mukvo

// �� Checkout Complete - Mark card as sold to a user
export const checkoutComplete = createAsyncThunk(
  "card/checkoutComplete",
  async (payload, { rejectWithValue }) => {
    console.log("💳 checkoutComplete payload:", payload); // { barcode }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No token found. Please log in again.");
      }

      const res = await fetch(`${API_URL}/checkout-complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // { barcode }
      });
      const data = await res.json();
      console.log("💳 checkoutComplete response:", data);
      if (!res.ok) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// �� Request OTP - Send OTP to the owner's mobile for activation
export const requestOtp = createAsyncThunk(
  "card/requestOtp",
  async (payload, { rejectWithValue }) => {
    console.log("💳 requestOtp payload:", payload); // { barcode }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No token found. Please log in again.");
      }

      const res = await fetch(`${API_URL}/request-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // { barcode }
      });
      const data = await res.json();
      console.log("💳 requestOtp response:", data);
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🟢 Activate Card - Activate card with OTP and assign msisdn
export const activateCard = createAsyncThunk(
  "card/activateCard",
  async (payload, { rejectWithValue }) => {
    console.log("💳 activateCard payload:", payload); // { barcode, otp }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No token found. Please log in again.");
      }

      const res = await fetch(`${API_URL}/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // { barcode, otp }
      });
      const data = await res.json();
      console.log("💳 activateCard response:", data);
      if (!res.ok) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice
const cardSlice = createSlice({
  name: "card",
  initialState: {
    currentCard: null,
    loading: false,
    error: null,
    otpSent: false,
    activationSuccess: false,
  },
  reducers: {
    // Clear card state
    clearCardState: (state) => {
      state.currentCard = null;
      state.error = null;
      state.otpSent = false;
      state.activationSuccess = false;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Reset OTP state
    resetOtpState: (state) => {
      state.otpSent = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Checkout Complete
      .addCase(checkoutComplete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutComplete.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCard = action.payload;
        state.error = null;
      })
      .addCase(checkoutComplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Request OTP
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.error = null;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpSent = false;
      })

      // Activate Card
      .addCase(activateCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateCard.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCard = action.payload;
        state.activationSuccess = true;
        state.otpSent = false;
        state.error = null;
      })
      .addCase(activateCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.activationSuccess = false;
      });
  },
});

// Export actions
export const { clearCardState, clearError, resetOtpState } = cardSlice.actions;

// Export reducer
export default cardSlice.reducer;