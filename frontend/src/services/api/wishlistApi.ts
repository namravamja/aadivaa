import { WishlistApi } from "./index";

export const wishlistApi = WishlistApi.injectEndpoints({
  endpoints: (builder) => ({
    addToWishlist: builder.mutation({
      query: (productId: string) => ({
        url: "/add",
        method: "POST",
        body: { productId },
      }),
    }),

    getWishlist: builder.query({
      query: () => "/get",
    }),

    removeFromWishlist: builder.mutation({
      query: (productId: string) => ({
        url: `/delete`,
        method: "DELETE",
        body: { productId },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} = wishlistApi;
