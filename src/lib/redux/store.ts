import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import userReducer from "./slices/userSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { productApi } from "./services/fetchApiData";

export const store = configureStore({
    reducer: {
        products: productReducer,
        user: userReducer,
        [productApi.reducerPath]: productApi.reducer,
    },
    middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(productApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;