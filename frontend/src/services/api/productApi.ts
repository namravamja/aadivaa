import { ProductApi } from "./index"; // Assuming you want to use the same ProductApi base

export const productApi = ProductApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new product (with image uploads)
    createProduct: builder.mutation({
      query: (productData) => {
        if (productData instanceof FormData) {
          return {
            url: "/create",
            method: "POST",
            body: productData,
            // No need to set headers – fetchBaseQuery will handle FormData automatically
          };
        } else {
          return {
            url: "/create",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          };
        }
      },
    }),

    // Update an existing product (with optional image updates)
    updateProduct: builder.mutation({
      query: ({ productId, updatedData }) => {
        if (updatedData instanceof FormData) {
          return {
            url: `/update/${productId}`,
            method: "PUT",
            body: updatedData,
            formData: true,
          };
        } else {
          return {
            url: `/update/${productId}`,
            method: "PUT",
            body: updatedData,
          };
        }
      },
    }),

    getProductByArtist: builder.query({
      query: () => "/listP",
    }),

    // Get all products
    getAllProducts: builder.query({
      query: () => "/list",
    }),

    // Get product by ID
    getProductById: builder.query({
      query: (productId) => `/${productId}`,
    }),

    deleteProduct: builder.mutation({
      query: (productId: string) => ({
        url: `/delete/${productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByArtistQuery,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useDeleteProductMutation,
} = productApi;
