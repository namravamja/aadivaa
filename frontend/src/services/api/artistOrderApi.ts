import { ArtistApi } from "./index";

export const artistOrderApi = ArtistApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get artist orders
    getArtistOrders: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.status) searchParams.append("status", params.status);
        if (params.paymentStatus)
          searchParams.append("paymentStatus", params.paymentStatus);
        return `/order?${searchParams.toString()}`;
      },
    }),

    // Get specific order by ID for artist
    getArtistOrderById: builder.query({
      query: (orderId) => `/order/${orderId}`,
    }),

    // Update order status
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/order/${orderId}/status`,
        method: "PUT",
        body: { status },
      }),
    }),

    // Update payment status
    updateOrderPaymentStatus: builder.mutation({
      query: ({ orderId, paymentStatus, transactionId }) => ({
        url: `/order/${orderId}/payment-status`,
        method: "PUT",
        body: { paymentStatus, transactionId },
      }),
    }),

    // Get order items by artist
    getOrderItemsByArtist: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.status) searchParams.append("status", params.status);
        if (params.paymentStatus)
          searchParams.append("paymentStatus", params.paymentStatus);
        return `/order-items?${searchParams.toString()}`;
      },
    }),

    // Bulk update order status
    bulkUpdateOrderStatus: builder.mutation({
      query: ({ orderIds, status }) => ({
        url: `/orders/bulk-status`,
        method: "PUT",
        body: { orderIds, status },
      }),
    }),
  }),
});

export const {
  useGetArtistOrdersQuery,
  useGetArtistOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderPaymentStatusMutation,
  useGetOrderItemsByArtistQuery,
  useBulkUpdateOrderStatusMutation,
} = artistOrderApi;

export default artistOrderApi;
