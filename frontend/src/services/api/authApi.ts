import { AuthApi } from "./index";

export const authApi = AuthApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing endpoints...
    signupBuyer: builder.mutation({
      query: (buyerData) => ({
        url: "/buyer/signup",
        method: "POST",
        body: buyerData,
      }),
    }),

    loginBuyer: builder.mutation({
      query: (credentials) => ({
        url: "/buyer/login",
        method: "POST",
        body: credentials,
      }),
    }),

    signupArtist: builder.mutation({
      query: (artistData) => ({
        url: "/artist/signup",
        method: "POST",
        body: artistData,
      }),
    }),

    loginArtist: builder.mutation({
      query: (credentials) => ({
        url: "/artist/login",
        method: "POST",
        body: credentials,
      }),
    }),

    verifyEmail: builder.query({
      query: (verificationToken) => ({
        url: `/verify-email?token=${verificationToken}`,
        method: "GET",
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    // New Google OAuth endpoints
    initiateGoogleAuthBuyer: builder.mutation({
      query: () => ({
        url: "/google/buyer",
        method: "GET",
      }),
    }),

    initiateGoogleAuthArtist: builder.mutation({
      query: () => ({
        url: "/google/artist",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSignupBuyerMutation,
  useLoginBuyerMutation,
  useSignupArtistMutation,
  useLoginArtistMutation,
  useVerifyEmailQuery,
  useLogoutMutation,
  useInitiateGoogleAuthBuyerMutation,
  useInitiateGoogleAuthArtistMutation,
} = authApi;
