import { ArtistApi } from "./index";

export const artistApi = ArtistApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new artist (requires token)
    createartist: builder.mutation({
      query: (artistData) => ({
        url: "/create",
        method: "POST",
        body: artistData,
      }),
    }),

    // Get all artists (public route)
    getartists: builder.query({
      query: () => "/list",
    }),

    // Get artist info from token
    getartist: builder.query({
      query: () => "/view",
    }),

    // Update artist main info from token
    updateartist: builder.mutation({
      query: (updatedData) => {
        // Check if updatedData is FormData (contains files)
        if (updatedData instanceof FormData) {
          return {
            url: "/update",
            method: "PUT",
            body: updatedData,
            // Don't set Content-Type header, let the browser set it for FormData with boundary
            formData: true, // This is a hint for RTK Query
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

    // Update business address
    updateBusinessAddress: builder.mutation({
      query: (addressData) => ({
        url: "/update/business-address",
        method: "PUT",
        body: addressData,
      }),
    }),

    // Update warehouse address
    updateWarehouseAddress: builder.mutation({
      query: (addressData) => ({
        url: "/update/warehouse-address",
        method: "PUT",
        body: addressData,
      }),
    }),

    // Update documents (handles file uploads)
    updateDocuments: builder.mutation({
      query: (documentsData) => {
        // Check if documentsData is FormData (contains files)
        if (documentsData instanceof FormData) {
          return {
            url: "/update/documents",
            method: "PUT",
            body: documentsData,
            formData: true,
          };
        } else {
          // If it's regular JSON data, send as JSON
          return {
            url: "/update/documents",
            method: "PUT",
            body: documentsData,
          };
        }
      },
    }),

    // Update social links
    updateSocialLinks: builder.mutation({
      query: (socialLinksData) => ({
        url: "/update/social-links",
        method: "PUT",
        body: socialLinksData,
      }),
    }),

    // Delete artist (based on token)
    deleteartist: builder.mutation({
      query: () => ({
        url: "/delete",
        method: "DELETE",
      }),
    }),

    // Get all reviews written on the artist's products
    getArtistReviews: builder.query({
      query: () => "/reviews",
    }),

    // Update review verification status
    updateReviewVerificationStatus: builder.mutation({
      query: (verificationData) => ({
        url: "/reviews/verify",
        method: "PUT",
        body: verificationData,
      }),
    }),

    // Delete a review by artist
    deleteReviewByArtist: builder.mutation({
      query: (deleteData) => ({
        url: "/reviews/delete",
        method: "DELETE",
        body: deleteData,
      }),
    }),

    forgotPasswordArtist: builder.mutation({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPasswordArtist: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyResetTokenArtist: builder.query({
      query: (token) => `/verify-reset-token/${token}`,
    }),
  }),
});

export const {
  useCreateartistMutation,
  useGetartistsQuery,
  useGetartistQuery,
  useUpdateartistMutation,
  useUpdateBusinessAddressMutation,
  useUpdateWarehouseAddressMutation,
  useUpdateDocumentsMutation,
  useUpdateSocialLinksMutation,
  useDeleteartistMutation,
  useGetArtistReviewsQuery,
  useUpdateReviewVerificationStatusMutation,
  useDeleteReviewByArtistMutation,
  useForgotPasswordArtistMutation,
  useResetPasswordArtistMutation,
  useVerifyResetTokenArtistQuery,
} = artistApi;
