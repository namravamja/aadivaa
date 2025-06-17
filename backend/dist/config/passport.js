"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientID || !clientSecret) {
    throw new Error("❌ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment variables");
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID,
    clientSecret,
    callbackURL: "/api/auth/google/callback",
    scope: ["profile", "email"],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const { id, emails, photos, name } = profile;
        const email = emails?.[0]?.value;
        const avatar = photos?.[0]?.value;
        const firstName = name?.givenName;
        const lastName = name?.familyName;
        if (!email) {
            return done(new Error("No email found in Google profile"), false);
        }
        const userType = "buyer";
        if (userType === "buyer") {
            let buyer = await prisma.buyer.findFirst({
                where: {
                    OR: [{ googleId: id }, { email }],
                },
            });
            if (buyer) {
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
                }
                else {
                    buyer = await prisma.buyer.update({
                        where: { id: buyer.id },
                        data: {
                            isAuthenticated: true,
                            avatar: avatar || buyer.avatar,
                        },
                    });
                }
            }
            else {
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
                        password: null,
                    },
                });
            }
            const token = (0, jwt_1.generateToken)({ id: buyer.id, role: "BUYER" });
            return done(null, {
                ...buyer,
                role: "BUYER",
                token,
                isNewUser: !buyer.createdAt ||
                    Date.now() - new Date(buyer.createdAt).getTime() < 60000,
            });
        }
        else {
            let artist = await prisma.artist.findFirst({
                where: {
                    OR: [{ googleId: id }, { email }],
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
                            fullName: `${firstName} ${lastName}`.trim() || artist.fullName,
                            isVerified: true,
                            isAuthenticated: true,
                        },
                    });
                }
                else {
                    artist = await prisma.artist.update({
                        where: { id: artist.id },
                        data: {
                            isAuthenticated: true,
                            businessLogo: avatar || artist.businessLogo,
                        },
                    });
                }
            }
            else {
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
            const token = (0, jwt_1.generateToken)({ id: artist.id, role: "ARTIST" });
            return done(null, {
                ...artist,
                role: "ARTIST",
                token,
                isNewUser: !artist.createdAt ||
                    Date.now() - new Date(artist.createdAt).getTime() < 60000,
            });
        }
    }
    catch (error) {
        console.error("Google OAuth Error:", error);
        return done(error, false);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, { id: user.id, role: user.role });
});
passport_1.default.deserializeUser(async (data, done) => {
    try {
        let user;
        if (data.role === "BUYER") {
            user = await prisma.buyer.findUnique({ where: { id: data.id } });
        }
        else {
            user = await prisma.artist.findUnique({ where: { id: data.id } });
        }
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map