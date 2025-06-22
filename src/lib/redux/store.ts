import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import userReducer from "./slices/userSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { ecommerceApi } from "./services/ecommerceApi";

export const store = configureStore({
    reducer: {
        products: productReducer,
        user: userReducer,
        [ecommerceApi.reducerPath]: ecommerceApi.reducer,
    },
    middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(ecommerceApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;