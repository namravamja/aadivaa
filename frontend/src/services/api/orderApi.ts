import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrderApi } from "./index";

export const orderApi = OrderApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/create",
        method: "POST",
        body: {
          ...orderData,
          transactionTimeout: 10000, // 10 seconds for database transaction
        },
      }),
    }),

    // Get buyer orders
    getBuyerOrders: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.status) searchParams.append("status", params.status);
        return `/list?${searchParams.toString()}`;
      },
    }),

    // Get specific order by ID
    getOrderById: builder.query({
      query: (orderId) => `/${orderId}`,
    }),

    // Cancel order
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/cancel/${orderId}`,
        method: "PUT",
      }),
    }),

    // Update payment status
    updatePaymentStatus: builder.mutation({
      query: ({ orderId, paymentData }) => ({
        url: `/payment/${orderId}`,
        method: "PUT",
        body: paymentData,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetBuyerOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useUpdatePaymentStatusMutation,
} = orderApi;

export default orderApi;
