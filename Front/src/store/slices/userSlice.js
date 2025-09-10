import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost:5000/api/users/profile", {
                method: "GET",
                credentials: "include", // important if using cookies/session
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || "Failed to fetch profile");
            }

            const result = await response.json();
            return result.data; // ✅ your controller returns { success, data }
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch profile");
        }
    }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
    "auth/updateUserProfile",
    async (updatedData, { rejectWithValue }) => {
        try {
            const isFormData = updatedData instanceof FormData;

            const response = await fetch("http://localhost:5000/api/users/profile", {
                method: "PUT",
                credentials: "include",
                headers: isFormData
                    ? {} // ✅ let browser set multipart/form-data with boundary
                    : { "Content-Type": "application/json" },
                body: isFormData ? updatedData : JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || "Failed to update profile");
            }

            const result = await response.json();
            return result.data; // backend returns { success, data }
        } catch (error) {
            return rejectWithValue(error.message || "Failed to update profile");
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
