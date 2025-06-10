"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;
    const message = {
        from: '"Your Aadivaa E-Com" <no-reply@aadivaa.com>',
        to: email,
        subject: "Verify your email for Aadivaa E-Com",
        html: `
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verificationUrl}" style="padding:10px 20px; background:#4ade80; color:#000; text-decoration:none; border-radius:5px;">Verify Email</a>
      <p>If you did not signup, ignore this email.</p>
    `,
    };
    await transporter.sendMail(message);
};
exports.sendVerificationEmail = sendVerificationEmail;
//# sourceMappingURL=mailer.js.map