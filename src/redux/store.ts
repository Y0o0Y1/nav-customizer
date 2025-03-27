import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./slices/uiSlice";
import { navigationApi } from "../api/services/navigationApi";

export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        [navigationApi.reducerPath]: navigationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(navigationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
