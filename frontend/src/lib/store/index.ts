import { configureStore } from "@reduxjs/toolkit";
import { AuthApi, BuyerApi, ArtistApi, ProductApi } from "@/services/api"; // base API with injectEndpoints
// Import the authApi to ensure endpoints are injected, but don't use it in store
import "@/services/api/authApi"; // This ensures auth endpoints are injected into the base api
import "@/services/api/artistApi";
import "@/services/api/buyerApi";
import "@/services/api/productApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      [AuthApi.reducerPath]: AuthApi.reducer, // Only include the base API reducer
      [BuyerApi.reducerPath]: BuyerApi.reducer, // Only include the base API reducer
      [ArtistApi.reducerPath]: ArtistApi.reducer, // Only include the base API reducer
      [ProductApi.reducerPath]: ProductApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        AuthApi.middleware,
        BuyerApi.middleware,
        ArtistApi.middleware,
        ProductApi.middleware
      ), // Only include the base API middleware
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
