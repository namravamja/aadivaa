import { configureStore } from "@reduxjs/toolkit";
import {
  AuthApi,
  BuyerApi,
  ArtistApi,
  ProductApi,
  CartApi,
  WishlistApi,
} from "@/services/api"; // base API with injectEndpoints
import "@/services/api/authApi"; // This ensures auth endpoints are injected into the base api
import "@/services/api/artistApi";
import "@/services/api/buyerApi";
import "@/services/api/productApi";
import "@/services/api/cartApi";
import "@/services/api/wishlistApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      [AuthApi.reducerPath]: AuthApi.reducer, // Only include the base API reducer
      [BuyerApi.reducerPath]: BuyerApi.reducer, // Only include the base API reducer
      [ArtistApi.reducerPath]: ArtistApi.reducer, // Only include the base API reducer
      [ProductApi.reducerPath]: ProductApi.reducer,
      [CartApi.reducerPath]: CartApi.reducer,
      [WishlistApi.reducerPath]: WishlistApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        AuthApi.middleware,
        BuyerApi.middleware,
        ArtistApi.middleware,
        ProductApi.middleware,
        CartApi.middleware,
        WishlistApi.middleware
      ), // Only include the base API middleware
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
