import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AuthApi = createApi({
  reducerPath: "api1",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/auth",
    credentials: "include",
  }),
  endpoints: () => ({}),
});

export const BuyerApi = createApi({
  reducerPath: "api2",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/buyer",
    credentials: "include",
  }),
  endpoints: () => ({}),
});

export const ArtistApi = createApi({
  reducerPath: "api3",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/artist",
    credentials: "include",
  }),
  endpoints: () => ({}),
});

export const ProductApi = createApi({
  reducerPath: "api4",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/product",
    credentials: "include",
  }),
  endpoints: () => ({}),
});
