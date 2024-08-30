import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { message } from 'antd';

const initialState = {
    user: null,
    loading: false,
    error: null,
    pipelines: [],  // Add pipelines state
    subpipelines: [],  // Add subpipelines state
    branches: [] // Add branch state
};


// Thunk to handle user login
export const loginApi = createAsyncThunk(
    'user/login',
    async (values, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/users/login`, {
                email: values.email,
                password: values.password,
            });

            // Fetch pipelines after successful login
            await dispatch(fetchPipelines());

            await dispatch(fetchSubPipelines());

            await dispatch(fetchBranches());

            return response.data;

        } catch (error) {
            return rejectWithValue(error.response.data); // Pass the error to the rejected action
        }
    }
);

// Thunk to fetch pipelines data
export const fetchPipelines = createAsyncThunk(
    'pipeline/fetchPipelines',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/pipelines/get-pipelines`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk to fetch SubPipelines data
export const fetchSubPipelines = createAsyncThunk(
    'subpipeline/fetchSubPipelines',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/subpipelines/get-subpipelines`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk to fetch Branches data
export const fetchBranches = createAsyncThunk(
    'branches/fetchBranches',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/branch/get-branches`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const loginSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null; // Clear user on logout
            state.loading = false;
            state.error = null;
            state.pipelines = [];  // Clear pipelines on logout
            state.subpipelines = [];  // Clear subpipelines on logout
            state.branches = [];  // Clear branches on logout
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginApi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginApi.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginApi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPipelines.fulfilled, (state, action) => {
                state.pipelines = action.payload;
            })
            .addCase(fetchPipelines.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(fetchSubPipelines.fulfilled, (state, action) => {
                state.subpipelines = action.payload;
            })
            .addCase(fetchSubPipelines.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.branches = action.payload;
            })
            .addCase(fetchBranches.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { logout } = loginSlice.actions;

export default loginSlice.reducer;
