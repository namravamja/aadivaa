"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../../config/passport"));
const express_session_1 = __importDefault(require("express-session"));
const auth_controller_1 = require("../../controllers/common/auth.controller");
const googleAuth_controller_1 = require("../../controllers/common/googleAuth.controller");
const logout_controller_1 = require("../../controllers/common/logout.controller");
const verifymail_controller_1 = require("../../controllers/common/verifymail.controller");
const router = express_1.default.Router();
// Session middleware for Google OAuth
router.use((0, express_session_1.default)({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));
// Initialize Passport
router.use(passport_1.default.initialize());
router.use(passport_1.default.session());
// Buyer routes
router.post("/buyer/signup", auth_controller_1.signupBuyer);
router.post("/buyer/login", auth_controller_1.loginBuyer);
// Artist routes
router.post("/artist/signup", auth_controller_1.signupArtist);
router.post("/artist/login", auth_controller_1.loginArtist);
// Google OAuth routes for buyers
router.get("/google/buyer", (0, googleAuth_controller_1.initiateGoogleAuth)("buyer"), passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
    state: "buyer",
}));
// Google OAuth routes for artists
router.get("/google/artist", (0, googleAuth_controller_1.initiateGoogleAuth)("artist"), passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
    state: "artist",
}));
// Google OAuth callback
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/auth/error" }), googleAuth_controller_1.googleCallback);
// Verification routes
router.get("/verify-email", verifymail_controller_1.verifyEmail);
router.post("/logout", logout_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map