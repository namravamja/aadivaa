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

    // Update artist info from token
    updateartist: builder.mutation({
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

    // Delete artist (based on token)
    deleteartist: builder.mutation({
      query: () => ({
        url: "/delete",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateartistMutation,
  useGetartistsQuery,
  useGetartistQuery,
  useUpdateartistMutation,
  useDeleteartistMutation,
} = artistApi;
