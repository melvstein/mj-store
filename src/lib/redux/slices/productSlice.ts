import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TProduct } from "@/types";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
    const response = await fetch("/api/products"); 
    return response.json();
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