"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const logout = async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            if (decoded.role === "BUYER") {
                await prisma.buyer.update({
                    where: { id: decoded.id },
                    data: { isAuthenticated: false },
                });
            }
            else if (decoded.role === "ARTIST") {
                await prisma.artist.update({
                    where: { id: decoded.id },
                    data: { isAuthenticated: false },
                });
            }
        }
        catch (err) {
            // Token might be expired or tampered — ignore and still clear cookie
        }
    }
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.json({ message: "Logged out successfully" });
};
exports.logout = logout;
//# sourceMappingURL=logout.controller.js.map