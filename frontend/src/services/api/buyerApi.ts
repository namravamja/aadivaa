import { BuyerApi } from "./index";

export const buyerApi = BuyerApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new buyer (requires token)
    createBuyer: builder.mutation({
      query: (buyerData) => ({
        url: "/create",
        method: "POST",
        body: buyerData,
      }),
    }),

    // Get all buyers (public route)
    getBuyers: builder.query({
      query: () => "/list",
    }),

    // Get buyer info from token
    getBuyer: builder.query({
      query: () => "/view",
    }),

    // Update buyer info from token
    updateBuyer: builder.mutation({
      query: (updatedData) => ({
        url: "/update",
        method: "PUT",
        body: updatedData,
      }),
    }),

    // Delete buyer (based on token)
    deleteBuyer: builder.mutation({
      query: () => ({
        url: "/delete",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateBuyerMutation,
  useGetBuyersQuery,
  useGetBuyerQuery,
  useUpdateBuyerMutation,
  useDeleteBuyerMutation,
} = buyerApi;
