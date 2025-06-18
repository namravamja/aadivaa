"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResetToken = exports.resetPassword = exports.forgotPassword = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("../../../utils/jwt");
const crypto_1 = __importDefault(require("crypto"));
const forgotMailer_1 = require("../../../helpers/forgotMailer");
const prisma = new client_1.PrismaClient();
const forgotPassword = async (email) => {
    const buyer = await prisma.buyer.findUnique({
        where: { email },
    });
    if (!buyer) {
        throw new Error("No account found with this email address");
    }
    // Generate reset token
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    // Update buyer with reset token
    await prisma.buyer.update({
        where: { id: buyer.id },
        data: {
            forgotPasswordToken: resetToken,
            forgotPasswordExpires: resetTokenExpiry,
        },
    });
    // Send email
    await (0, forgotMailer_1.sendBuyerForgotPasswordEmail)(email, resetToken);
    return { message: "Password reset email sent successfully" };
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (token, newPassword) => {
    const buyer = await prisma.buyer.findFirst({
        where: {
            forgotPasswordToken: token,
            forgotPasswordExpires: {
                gt: new Date(),
            },
        },
    });
    if (!buyer) {
        throw new Error("Invalid or expired reset token");
    }
    const hashedPassword = await (0, jwt_1.hashPassword)(newPassword);
    await prisma.buyer.update({
        where: { id: buyer.id },
        data: {
            password: hashedPassword,
            forgotPasswordToken: null,
            forgotPasswordExpires: null,
        },
    });
    return { message: "Password reset successful" };
};
exports.resetPassword = resetPassword;
const verifyResetToken = async (token) => {
    const buyer = await prisma.buyer.findFirst({
        where: {
            forgotPasswordToken: token,
            forgotPasswordExpires: {
                gt: new Date(),
            },
        },
    });
    if (!buyer) {
        throw new Error("Invalid or expired reset token");
    }
    return { valid: true, email: buyer.email };
};
exports.verifyResetToken = verifyResetToken;
//# sourceMappingURL=forgot.service.js.map