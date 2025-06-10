"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.loginArtist = exports.signupArtist = exports.loginBuyer = exports.signupBuyer = void 0;
const authService = __importStar(require("../../services/common/auth.service"));
const signupBuyer = async (req, res) => {
    try {
        const result = await authService.signupBuyer(req.body);
        res.status(201).json(result);
        res.json({ message: "Signup buyer successful" });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.signupBuyer = signupBuyer;
const loginBuyer = async (req, res) => {
    try {
        const { token } = await authService.loginBuyer(req.body);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ message: "Login buyer successful" });
    }
    catch (err) {
        res.status(401).json({ error: err.message });
    }
};
exports.loginBuyer = loginBuyer;
const signupArtist = async (req, res) => {
    try {
        const result = await authService.signupArtist(req.body);
        res.json({ message: "Signup artist successful" });
        res.status(201).json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.signupArtist = signupArtist;
const loginArtist = async (req, res) => {
    try {
        const { token } = await authService.loginArtist(req.body);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ message: "Login artist successful" });
    }
    catch (err) {
        res.status(401).json({ error: err.message });
    }
};
exports.loginArtist = loginArtist;
// export const logout = (req: Request, res: Response) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   });
//   res.json({ message: "Logged out successfully" });
// };
const jwt_1 = require("../../utils/jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const verifyEmail = async (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
        res.status(400).json({ error: "Verification token is required" });
        return;
    }
    try {
        const payload = (0, jwt_1.verifyVerificationToken)(token);
        if (payload.role === "BUYER") {
            const buyer = await prisma.buyer.findUnique({
                where: { id: payload.id },
            });
            if (!buyer || buyer.isVerified) {
                return res
                    .status(400)
                    .json({ error: "Invalid or already verified token" });
            }
            if (buyer.verifyToken !== token || buyer.verifyExpires < new Date()) {
                return res
                    .status(400)
                    .json({ error: "Verification token expired or invalid" });
            }
            await prisma.buyer.update({
                where: { id: buyer.id },
                data: {
                    isVerified: true,
                    verifyToken: null,
                    verifyExpires: null,
                },
            });
        }
        else if (payload.role === "ARTIST") {
            const artist = await prisma.artist.findUnique({
                where: { id: payload.id },
            });
            if (!artist || artist.isVerified) {
                return res
                    .status(400)
                    .json({ error: "Invalid or already verified token" });
            }
            if (artist.verifyToken !== token || artist.verifyExpires < new Date()) {
                return res
                    .status(400)
                    .json({ error: "Verification token expired or invalid" });
            }
            await prisma.artist.update({
                where: { id: artist.id },
                data: {
                    isVerified: true,
                    verifyToken: null,
                    verifyExpires: null,
                },
            });
        }
        // Redirect to frontend login page after successful verification
        return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.verifyEmail = verifyEmail;
//# sourceMappingURL=auth.controller.js.map