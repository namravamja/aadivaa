import { ProductApi } from "./index"; // Assuming you want to use the same ProductApi base

export const productApi = ProductApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new product (with image uploads)
    createProduct: builder.mutation({
      query: (productData) => {
        if (productData instanceof FormData) {
          return {
            url: "/product/create",
            method: "POST",
            body: productData,
            formData: true,
          };
        } else {
          return {
            url: "/product/create",
            method: "POST",
            body: productData,
          };
        }
      },
    }),

    // Update an existing product (with optional image updates)
    updateProduct: builder.mutation({
      query: ({ productId, updatedData }) => {
        if (updatedData instanceof FormData) {
          return {
            url: `/product/update/${productId}`,
            method: "PUT",
            body: updatedData,
            formData: true,
          };
        } else {
          return {
            url: `/product/update/${productId}`,
            method: "PUT",
            body: updatedData,
          };
        }
      },
    }),

    // Get all products
    getAllProducts: builder.query({
      query: () => "/product/list",
    }),

    // Get product by ID
    getProductById: builder.query({
      query: (productId) => `/product/${productId}`,
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
} = productApi;
