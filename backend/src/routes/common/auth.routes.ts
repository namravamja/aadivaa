import express from "express";
import passport from "../../config/passport";
import session from "express-session";
import {
  loginBuyer,
  signupBuyer,
  loginArtist,
  signupArtist,
} from "../../controllers/common/auth.controller";
import {
  googleCallback,
  initiateGoogleAuth,
} from "../../controllers/common/googleAuth.controller";
import { logout } from "../../controllers/common/logout.controller";
import { verifyEmail } from "../../controllers/common/verifymail.controller";

const router = express.Router();

// Session middleware for Google OAuth
router.use(
  session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
router.use(passport.initialize());
router.use(passport.session());

// Buyer routes
router.post("/buyer/signup", signupBuyer);
router.post("/buyer/login", loginBuyer);

// Artist routes
router.post("/artist/signup", signupArtist);
router.post("/artist/login", loginArtist);

// Google OAuth routes for buyers
router.get(
  "/google/buyer",
  initiateGoogleAuth("buyer"),
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "buyer",
  })
);

// Google OAuth routes for artists
router.get(
  "/google/artist",
  initiateGoogleAuth("artist"),
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "artist",
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/error" }),
  googleCallback
);

// Verification routes
router.get("/verify-email", verifyEmail);

router.post("/logout", logout);

export default router;
