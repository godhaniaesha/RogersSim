import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token"); // ✅ get token

            if (!token) {
                return rejectWithValue("No token found. Please log in again.");
            }

            const response = await fetch("http://localhost:5000/api/users/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ✅ send token
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || "Failed to fetch profile");
            }

            const result = await response.json();
            return result.data; // { success, data }
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
            const token = localStorage.getItem("token");
            let response;

            if (updatedData instanceof FormData) {
                // 👉 Image + other fields
                response = await axios.put(
                    "http://localhost:5000/api/users/profile",
                    updatedData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data", // important for images
                        },
                    }
                );
            } else {
                // 👉 JSON payload
                response = await axios.put(
                    "http://localhost:5000/api/users/profile",
                    updatedData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            return response.data?.data; // ✅ updated user object
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to update profile"
            );
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
                state.isAuthenticated = false;
            })
            // Update profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload }; // ✅ merge updates dynamically
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
