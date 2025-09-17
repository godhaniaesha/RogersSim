import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Upload KYC documents
export const uploadKyc = createAsyncThunk(
    'kyc/uploadKyc',
    async (formData, { rejectWithValue }) => {
        console.log(formData, "formData");
        try {
            const token = localStorage.getItem('token');
            console.log(token, "token");
            const response = await axios.post(
                'http://localhost:5000/api/users/kyc',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log(response, "response");

            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to upload KYC'
            );
        }
    }
);

// Get KYC status
export const getKycStatus = createAsyncThunk(
    'kyc/getKycStatus',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users/kyc', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch KYC status'
            );
        }
    }
);

const kycSlice = createSlice({
    name: 'kyc',
    initialState: {
        kycData: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadKyc.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadKyc.fulfilled, (state, action) => {
                state.loading = false;
                state.kycData = action.payload;
            })
            .addCase(uploadKyc.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getKycStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getKycStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.kycData = action.payload;
            })
            .addCase(getKycStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default kycSlice.reducer;
