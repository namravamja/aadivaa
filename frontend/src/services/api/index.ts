import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API URL - fallback to localhost if env var not set
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthApi = createApi({
  reducerPath: "api1",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/auth`,
    credentials: "include",
  }),
  endpoints: () => ({}),
});

export const BuyerApi = createApi({
  reducerPath: "api2",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/buyer`,
    credentials: "include",
  }),
  endpoints: () => ({}),
});

export const ArtistApi = createApi({
  reducerPath: "api3",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/artist`,
    credentials: "include",
  }),
  endpoints: () => ({}),
});

export const ProductApi = createApi({
  reducerPath: "api4",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/product`,
    credentials: "include",
  }),
  endpoints: () => ({}),
});

export const CartApi = createApi({
  reducerPath: "api5",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/buyer/cart`,
    credentials: "include",
  }),
  endpoints: () => ({}),
});

export const WishlistApi = createApi({
  reducerPath: "api6",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/buyer/wishlist`,
    credentials: "include",
  }),
  endpoints: () => ({}),
});

export const OrderApi = createApi({
  reducerPath: "api7",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/buyer/order`,
    credentials: "include",
  }),
  endpoints: () => ({}),
});
