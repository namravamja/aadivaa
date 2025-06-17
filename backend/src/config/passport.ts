import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, emails, photos, name } = profile;
        const email = emails?.[0]?.value;
        const avatar = photos?.[0]?.value;
        const firstName = name?.givenName;
        const lastName = name?.familyName;

        if (!email) {
          return done(new Error("No email found in Google profile"), false);
        }

        // Get user type from state parameter in the profile._json or default to buyer
        // If you are passing state in the OAuth flow, you should extract it from the request, not from profile
        // For now, default to "buyer"
        const userType = "buyer";

        if (userType === "buyer") {
          // Check if buyer already exists
          let buyer = await prisma.buyer.findFirst({
            where: {
              OR: [{ googleId: id }, { email: email }],
            },
          });

          if (buyer) {
            // Update existing buyer with Google info if not already set
            if (!buyer.googleId) {
              buyer = await prisma.buyer.update({
                where: { id: buyer.id },
                data: {
                  googleId: id,
                  provider: "google",
                  isOAuthUser: true,
                  avatar: avatar || buyer.avatar,
                  firstName: firstName || buyer.firstName,
                  lastName: lastName || buyer.lastName,
                  isVerified: true,
                  isAuthenticated: true,
                },
              });
            } else {
              // Just update authentication status
              buyer = await prisma.buyer.update({
                where: { id: buyer.id },
                data: {
                  isAuthenticated: true,
                  // Update avatar if it's newer/different
                  avatar: avatar || buyer.avatar,
                },
              });
            }
          } else {
            // Create new buyer with complete profile
            buyer = await prisma.buyer.create({
              data: {
                email,
                googleId: id,
                firstName: firstName || "",
                lastName: lastName || "",
                avatar: avatar || "",
                provider: "google",
                isOAuthUser: true,
                isVerified: true,
                isAuthenticated: true,
                // Set password as null for OAuth users
                password: null,
              },
            });
          }

          // Generate JWT token
          const token = generateToken({ id: buyer.id, role: "BUYER" });

          return done(null, {
            ...buyer,
            role: "BUYER",
            token,
            isNewUser:
              !buyer.createdAt ||
              Date.now() - new Date(buyer.createdAt).getTime() < 60000, // Less than 1 minute old
          });
        } else {
          // Handle artist
          let artist = await prisma.artist.findFirst({
            where: {
              OR: [{ googleId: id }, { email: email }],
            },
          });

          if (artist) {
            if (!artist.googleId) {
              artist = await prisma.artist.update({
                where: { id: artist.id },
                data: {
                  googleId: id,
                  provider: "google",
                  isOAuthUser: true,
                  businessLogo: avatar || artist.businessLogo,
                  fullName:
                    `${firstName} ${lastName}`.trim() || artist.fullName,
                  isVerified: true,
                  isAuthenticated: true,
                },
              });
            } else {
              artist = await prisma.artist.update({
                where: { id: artist.id },
                data: {
                  isAuthenticated: true,
                  businessLogo: avatar || artist.businessLogo,
                },
              });
            }
          } else {
            artist = await prisma.artist.create({
              data: {
                email,
                googleId: id,
                fullName: `${firstName} ${lastName}`.trim() || "",
                businessLogo: avatar || "",
                provider: "google",
                isOAuthUser: true,
                isVerified: true,
                isAuthenticated: true,
                password: null,
              },
            });
          }

          const token = generateToken({ id: artist.id, role: "ARTIST" });

          return done(null, {
            ...artist,
            role: "ARTIST",
            token,
            isNewUser:
              !artist.createdAt ||
              Date.now() - new Date(artist.createdAt).getTime() < 60000,
          });
        }
      } catch (error) {
        console.error("Google OAuth Error:", error);
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, { id: user.id, role: user.role });
});

passport.deserializeUser(async (data: any, done) => {
  try {
    let user;
    if (data.role === "BUYER") {
      user = await prisma.buyer.findUnique({ where: { id: data.id } });
    } else {
      user = await prisma.artist.findUnique({ where: { id: data.id } });
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
