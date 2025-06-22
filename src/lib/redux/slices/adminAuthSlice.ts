import { TLoginResponse } from "@/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

type LoginRequest = {
    username: string;
    password: string;
}

export const login = createAsyncThunk("auth/login", async ({ username, password } : LoginRequest, { rejectWithValue }) => {
    try {
        const response = await axios.post("/auth/login", {
            username,
            password
        })

        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response || "Unknown error occured");
        }

        return rejectWithValue("Internal Server Error");
    }
});

type loginState = {
    response: TLoginResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: loginState = {
    response: null,
    loading: true,
    error: null,
}

const loginSlice = createSlice({
    name: "adminLogin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.response = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to login"
        })
    },
});

export default loginSlice.reducer;