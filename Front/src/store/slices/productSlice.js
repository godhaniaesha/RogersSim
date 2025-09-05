import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  plans: [],
  addons: [],
  loading: false,
  error: null,
  filters: {
    simType: null,
    planType: null,
    priceRange: { min: 0, max: 10000 },
    popular: false,
  },
  sort: 'popularity', // 'popularity', 'price-low-high', 'price-high-low'
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchProductsStart());
      // In a real app, this would be an API call
      // For now, we'll just return mock data
      const mockProducts = [
        { id: 1, name: 'Rogers SIM', type: 'physical', price: 499, popular: true },
        { id: 2, name: 'Rogers eSIM', type: 'esim', price: 399, popular: false },
        { id: 3, name: 'Rogers IoT SIM', type: 'iot', price: 599, popular: true },
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch(fetchProductsSuccess(mockProducts));
      return mockProducts;
    } catch (error) {
      dispatch(fetchProductsFailure(error.message));
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
      state.loading = false;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProductByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductByIdSuccess: (state, action) => {
      state.selectedProduct = action.payload;
      state.loading = false;
    },
    fetchProductByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchPlansStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPlansSuccess: (state, action) => {
      state.plans = action.payload;
      state.loading = false;
    },
    fetchPlansFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchAddonsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAddonsSuccess: (state, action) => {
      state.addons = action.payload;
      state.loading = false;
    },
    fetchAddonsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredProducts = applyFiltersAndSort(state.products, state.filters, state.sort);
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.filteredProducts = applyFiltersAndSort(state.products, state.filters, state.sort);
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredProducts = applyFiltersAndSort(state.products, state.filters, state.sort);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Helper function to apply filters and sort
const applyFiltersAndSort = (products, filters, sort) => {
  let result = [...products];
  
  // Apply filters
  if (filters.simType) {
    result = result.filter(product => product.simType === filters.simType);
  }
  
  if (filters.planType) {
    result = result.filter(product => product.planType === filters.planType);
  }
  
  if (filters.priceRange) {
    result = result.filter(product => 
      product.price >= filters.priceRange.min && 
      product.price <= filters.priceRange.max
    );
  }
  
  if (filters.popular) {
    result = result.filter(product => product.isPopular);
  }
  
  // Apply sort
  switch (sort) {
    case 'popularity':
      result.sort((a, b) => b.popularity - a.popularity);
      break;
    case 'price-low-high':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-high-low':
      result.sort((a, b) => b.price - a.price);
      break;
    default:
      break;
  }
  
  return result;
};

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdStart,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
  fetchPlansStart,
  fetchPlansSuccess,
  fetchPlansFailure,
  fetchAddonsStart,
  fetchAddonsSuccess,
  fetchAddonsFailure,
  setFilters,
  setSort,
  clearFilters,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;