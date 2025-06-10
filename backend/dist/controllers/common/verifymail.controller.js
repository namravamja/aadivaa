"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = void 0;
const jwt_1 = require("../../utils/jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token || typeof token !== "string") {
            res.status(400).json({ error: "Verification token is required" });
            return;
        }
        const payload = (0, jwt_1.verifyVerificationToken)(token);
        if (payload.role === "BUYER") {
            const buyer = await prisma.buyer.findUnique({
                where: { id: payload.id },
            });
            if (!buyer || buyer.isVerified) {
                res.status(400).json({ error: "Invalid or already verified token" });
                return;
            }
            if (buyer.verifyToken !== token || buyer.verifyExpires < new Date()) {
                res
                    .status(400)
                    .json({ error: "Verification token expired or invalid" });
                return;
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
                res.status(400).json({ error: "Invalid or already verified token" });
                return;
            }
            if (artist.verifyToken !== token || artist.verifyExpires < new Date()) {
                res
                    .status(400)
                    .json({ error: "Verification token expired or invalid" });
                return;
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
        else {
            res.status(400).json({ error: "Invalid role in token" });
            return;
        }
        // Redirect to frontend login page after successful verification
        res.redirect(`${process.env.FRONTEND_URL}/`);
    }
    catch (err) {
        next(err); // Pass error to Express error handler
    }
};
exports.verifyEmail = verifyEmail;
//# sourceMappingURL=verifymail.controller.js.map