import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TUser } from "@/types";
import axios from "axios";

export const getUser = createAsyncThunk("users/getUser", async (email: string, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/users', { apiKey: "71e630c32911000d3ddb9c5e40672c01", email });
        return response.data.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data || "An unknown error occurred");
        }

        return rejectWithValue("Something went wrong");
    }
});

type UserState = {
    user: TUser | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(getUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to get user";
        })
    },
});

export default userSlice.reducer;