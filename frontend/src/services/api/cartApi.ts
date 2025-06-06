import { CartApi } from "./index";

export const cartApi = CartApi.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: ({
        productId,
        quantity,
      }: {
        productId: string;
        quantity: number;
      }) => ({
        url: "/add",
        method: "POST",
        body: { productId, quantity },
      }),
    }),

    getCart: builder.query({
      query: () => "/get",
    }),

    updateCartItem: builder.mutation({
      query: ({
        productId,
        quantity,
      }: {
        productId: string;
        quantity: number;
      }) => ({
        url: `/update`,
        method: "PUT",
        body: { productId, quantity },
      }),
    }),

    removeFromCart: builder.mutation({
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
  useAddToCartMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApi;
