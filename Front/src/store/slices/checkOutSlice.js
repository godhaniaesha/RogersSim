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

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        addresses: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetCheckout: (state) => {
            state.addresses = [];
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
            });
    },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;