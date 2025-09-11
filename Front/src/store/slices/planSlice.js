import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/plans';

const initialState = {
  plans: [],
  selectedPlan: null,
  loading: false,
  error: null,
};

/* ─────────── Async thunks ─────────── */

// GET /api/plans
export const fetchAllPlans = createAsyncThunk(
  'plans/fetchAllPlans',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data.data; // array of plans
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// GET /api/plans/product/:productId
export const fetchPlansByProductId = createAsyncThunk(
  'plans/fetchPlansByProductId',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/product/${productId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// GET /api/plans/:id
export const fetchPlanById = createAsyncThunk(
  'plans/fetchPlanById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// POST /api/plans
export const createPlan = createAsyncThunk(
  'plans/createPlan',
  async ({ planData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, planData, {
        headers: { Authorization: `Bearer ${token}` }, // if protected
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ─────────── Slice ─────────── */

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearPlanError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAllPlans
    builder
      .addCase(fetchAllPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchAllPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchPlansByProductId
    builder
      .addCase(fetchPlansByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlansByProductId.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload; // override with filtered plans
      })
      .addCase(fetchPlansByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchPlanById
    builder
      .addCase(fetchPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlan = action.payload;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createPlan
    builder
      .addCase(createPlan.fulfilled, (state, action) => {
        state.plans.push(action.payload);
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearPlanError } = planSlice.actions;
export default planSlice.reducer;
