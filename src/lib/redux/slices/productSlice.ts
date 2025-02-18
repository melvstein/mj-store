import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TProduct } from "@/types";
import axios from "axios";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
    try {
        const response = await axios.get('/api/products');
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error fetching products: ${error.message}`);
            throw new Error(error.message);
        }

        throw new Error("An unknown error occurred");
    }
});

type ProductState = {
    items: TProduct[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    items: [],
    loading: false,
    error: null,
}

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to fetch products";
        })
    },
});

export default productSlice.reducer;