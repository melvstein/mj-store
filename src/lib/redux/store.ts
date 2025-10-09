import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authenticationApi } from "./services/authenticationApi";
import { usersApi } from "./services/usersApi";
import { productsApi } from "./services/productsApi";
import { customersApi } from "./services/customersApi";
import { cartsApi } from "./services/cartsApi";

export const store = configureStore({
    reducer: {
        [authenticationApi.reducerPath]: authenticationApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [customersApi.reducerPath]: customersApi.reducer,
        [cartsApi.reducerPath]: cartsApi.reducer,
    },
    middleware: (getDefaultMiddleWare) =>getDefaultMiddleWare()
    .concat(authenticationApi.middleware)
    .concat(usersApi.middleware)
    .concat(productsApi.middleware)
    .concat(customersApi.middleware)
    .concat(cartsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;