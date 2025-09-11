import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchProductsStart());

      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();

      const products = data.data || data;

      console.log(products, "Fetched Products");

      dispatch(fetchProductsSuccess(products));
      return products;
    } catch (error) {
      dispatch(fetchProductsFailure(error.message));
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      const data = await response.json();
      return data; // API returns a single product object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const initialState = {
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  product: null,
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
  sort: "popularity",
};

const productSlice = createSlice({
  name: "product",
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
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredProducts = applyFiltersAndSort(
        state.products,
        state.filters,
        state.sort
      );
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.filteredProducts = applyFiltersAndSort(
        state.products,
        state.filters,
        state.sort
      );
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredProducts = applyFiltersAndSort(
        state.products,
        state.filters,
        state.sort
      );
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Helper function for filters & sorting
const applyFiltersAndSort = (products, filters, sort) => {
  let result = [...products];

  if (filters.simType) {
    result = result.filter((product) => product.simType === filters.simType);
  }

  if (filters.planType) {
    result = result.filter((product) => product.planType === filters.planType);
  }

  if (filters.priceRange) {
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
    );
  }

  if (filters.popular) {
    result = result.filter((product) => product.popular === true);
  }

  switch (sort) {
    case "popularity":
      result.sort((a, b) => (b.popular === a.popular ? 0 : b.popular ? 1 : -1));
      break;
    case "price-low-high":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high-low":
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
  setFilters,
  setSort,
  clearFilters,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;
