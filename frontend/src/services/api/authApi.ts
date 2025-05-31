import { AuthApi } from "./index";

export const authApi = AuthApi.injectEndpoints({
  endpoints: (builder) => ({
    // Buyer signup
    signupBuyer: builder.mutation({
      query: (buyerData) => ({
        url: "/buyer/signup",
        method: "POST",
        body: buyerData,
      }),
    }),

    // Buyer login
    loginBuyer: builder.mutation({
      query: (credentials) => ({
        url: "/buyer/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Artist signup
    signupArtist: builder.mutation({
      query: (artistData) => ({
        url: "/artist/signup",
        method: "POST",
        body: artistData,
      }),
    }),

    // Artist login
    loginArtist: builder.mutation({
      query: (credentials) => ({
        url: "/artist/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Verify email (GET with query params)
    verifyEmail: builder.query({
      query: (verificationToken) => ({
        url: `/verify-email?token=${verificationToken}`,
        method: "GET",
      }),
    }),

    // Logout (POST with no body)
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
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
} = authApi;
