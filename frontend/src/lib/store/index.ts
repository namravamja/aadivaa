import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/services/api"; // base API with injectEndpoints
// Import the authApi to ensure endpoints are injected, but don't use it in store
import "@/services/api/authApi"; // This ensures auth endpoints are injected into the base api
// import "@/services/api/artistApi";
// import "@/services/api/buyerApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer, // Only include the base API reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware), // Only include the base API middleware
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
