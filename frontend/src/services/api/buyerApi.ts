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
      query: (updatedData) => {
        // Check if updatedData contains a file (avatar)
        if (updatedData instanceof FormData) {
          // If it's FormData (contains file), send as multipart/form-data
          return {
            url: "/update",
            method: "PUT",
            body: updatedData,
            // Don't set Content-Type header, let the browser set it for FormData
          };
        } else {
          // If it's regular JSON data, send as JSON
          return {
            url: "/update",
            method: "PUT",
            body: updatedData,
          };
        }
      },
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
