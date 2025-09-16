import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/recharge";

// Helper to get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

// ----------------- Thunks -----------------

// Create Recharge
export const createRecharge = createAsyncThunk(
  "recharge/createRecharge",
  async (rechargeData, { rejectWithValue }) => {
    console.log("Creating recharge with data:", rechargeData);
    
    try {
      const res = await axios.post(API_URL, rechargeData, getAuthHeader());
      console.log("Recharge created successfully:", res.data);
      
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Get All Recharges (admin use-case)
export const getAllRecharges = createAsyncThunk(
  "recharge/getAllRecharges",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, getAuthHeader());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Get My Recharges (needs token)
export const getMyRecharges = createAsyncThunk(
  "recharge/getMyRecharges",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/my`, getAuthHeader());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Get Recharge by ID
export const getRechargeById = createAsyncThunk(
  "recharge/getRechargeById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`, getAuthHeader());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update Recharge
export const updateRecharge = createAsyncThunk(
  "recharge/updateRecharge",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updateData, getAuthHeader());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete Recharge
export const deleteRecharge = createAsyncThunk(
  "recharge/deleteRecharge",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader());
      return id; // return deleted id for filtering
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Buy Plan (extend expiry)
export const buyPlan = createAsyncThunk(
  "recharge/buyPlan",
  async (buyData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/buy-plan`, buyData, getAuthHeader());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ----------------- Slice -----------------

const rechargeSlice = createSlice({
  name: "recharge",
  initialState: {
    recharges: [],
    myRecharges: [],
    recharge: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearRechargeState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.recharge = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createRecharge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecharge.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.recharges.push(action.payload);
      })
      .addCase(createRecharge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(getAllRecharges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRecharges.fulfilled, (state, action) => {
        state.loading = false;
        state.recharges = action.payload;
      })
      .addCase(getAllRecharges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get My
      .addCase(getMyRecharges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyRecharges.fulfilled, (state, action) => {
        state.loading = false;
        state.myRecharges = action.payload;
      })
      .addCase(getMyRecharges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getRechargeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRechargeById.fulfilled, (state, action) => {
        state.loading = false;
        state.recharge = action.payload;
      })
      .addCase(getRechargeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateRecharge.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.recharge = action.payload;
        state.recharges = state.recharges.map((r) =>
          r._id === action.payload._id ? action.payload : r
        );
      })

      // Delete
      .addCase(deleteRecharge.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.recharges = state.recharges.filter((r) => r._id !== action.payload);
      })

      // Buy Plan
      .addCase(buyPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.recharge = action.payload;
        state.recharges = state.recharges.map((r) =>
          r._id === action.payload._id ? action.payload : r
        );
      });
  },
});

export const { clearRechargeState } = rechargeSlice.actions;
export default rechargeSlice.reducer;
