import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ GET all addresses
export const fetchAddresses = createAsyncThunk(
    "checkout/fetchAddresses",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/address", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch addresses");
            }
            const data = await response.json();

            return data.data.addresses;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ✅ POST new address
export const addAddress = createAsyncThunk(
    "checkout/addAddress",
    async (addressData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("No token found. Please log in again.");
            }

            // Map frontend fields to backend fields
            const backendAddress = {
                fullName: addressData.name,
                mobileNumber: addressData.mobile,
                address: addressData.address,
                city: addressData.city,
                state: addressData.state,
                pincode: addressData.pincode,
            };

            const response = await fetch("http://localhost:5000/api/address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(backendAddress),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to add address");
            }

            const data = await response.json();
            // Return only the newly added address (last in array)
            return data.data.addresses[data.data.addresses.length - 1];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ✅ PUT update address by index (not id)
export const updateAddress = createAsyncThunk(
    "checkout/updateAddress",
    async ({ index, ...addressData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("No token found. Please log in again.");
            }

            // Map frontend fields to backend fields
            const backendAddress = {
                fullName: addressData.name,
                mobileNumber: addressData.mobile,
                address: addressData.address,
                city: addressData.city,
                state: addressData.state,
                pincode: addressData.pincode,
            };

            const response = await fetch(`http://localhost:5000/api/address/${index}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(backendAddress),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to update address");
            }
            const data = await response.json();
            // Return the updated address at index
            return { index, address: data.data.addresses[index] };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ✅ GET Orders
export const fetchOrders = createAsyncThunk(
    "checkout/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("No token found. Please log in again.");
            }

            const response = await fetch("http://localhost:5000/api/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();
            console.log(data.data, 'dataaa from fetch orders');

            const checkouts = data.data
                .filter((order) => order.checkout !== null) // null hatare avoid karo
                .map((order) => order.checkout);

            console.log(checkouts, 'checkouts');

            return checkouts;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createCheckout = createAsyncThunk(
    "checkout/createCheckout",
    async (checkoutData, { rejectWithValue }) => {
        try {
            console.log("📦 Checkout Data to API:", checkoutData);

            const token = localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("No token found. Please log in again.");
            }

            const response = await fetch("http://localhost:5000/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(checkoutData),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to create checkout");
            }

            const data = await response.json();
            console.log("✅ API Response from createCheckout:", data);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ✅ GET Checkout by ID
export const fetchCheckoutById = createAsyncThunk(
  "checkout/fetchCheckoutById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/checkout/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to fetch checkout");
      }
      const data = await response.json();
      return data.data.checkout;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        addresses: [],
        orders: [],
        currentCheckout: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetCheckout: (state) => {
            state.addresses = [];
            state.orders = [];
            state.currentCheckout = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // GET
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // POST
            .addCase(addAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses.push(action.payload);
            })

            // PUT
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses[action.payload.index] = action.payload.address;
            })

            // ✅ Orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ✅ Create Checkout
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCheckout = action.payload;
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ✅ Fetch Checkout by ID
            .addCase(fetchCheckoutById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCheckoutById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCheckout = action.payload;
            })
            .addCase(fetchCheckoutById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;