"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendArtistForgotPasswordEmail = exports.sendBuyerForgotPasswordEmail = exports.sendForgotPasswordEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
// Generic function for both buyer and artist
const sendForgotPasswordEmail = async (email, resetToken, userType = "buyer") => {
    // Include user type in the reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&type=${userType}`;
    const mailOptions = {
        from: `"Aadivaa Earth" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `🔐 Reset Your Password - Aadivaa Earth`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50;
            background-color: #f8f9fa;
          }
          .email-wrapper {
            background-color: #f8f9fa;
            padding: 20px 0;
            min-height: 100vh;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #cb4f30 0%, #e85a3a 100%);
            color: white; 
            padding: 40px 30px 30px;
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20px;
            background: white;
            border-radius: 20px 20px 0 0;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          .subtitle {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
          }
          .content { 
            padding: 40px 30px;
            background-color: white;
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            color: #5a6c7d;
            margin-bottom: 30px;
            line-height: 1.7;
          }
          .user-type-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            ${userType === "artist"
            ? "background: linear-gradient(135deg, #8B5CF6, #A855F7); color: white;"
            : "background: linear-gradient(135deg, #3B82F6, #6366F1); color: white;"}
          }
          .reset-button { 
            display: inline-block; 
            padding: 16px 32px; 
            background: linear-gradient(135deg, #cb4f30, #e85a3a);
            color: white !important; 
            text-decoration: none; 
            border-radius: 30px; 
            margin: 25px 0;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(203, 79, 48, 0.3);
          }
          .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(203, 79, 48, 0.4);
          }
          .link-fallback {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #cb4f30;
          }
          .link-text {
            font-size: 14px;
            color: #5a6c7d;
            margin-bottom: 10px;
          }
          .url-text {
            word-break: break-all;
            color: #cb4f30;
            font-size: 13px;
            font-family: monospace;
            background-color: white;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e9ecef;
          }
          .security-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
          }
          .security-icon {
            font-size: 24px;
            margin-bottom: 10px;
          }
          .timer-text {
            font-weight: 600;
            color: #f39c12;
            font-size: 15px;
          }
          .ignore-text {
            font-size: 14px;
            color: #7f8c8d;
            font-style: italic;
            margin-top: 25px;
          }
          .footer { 
            text-align: center; 
            padding: 30px;
            background-color: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }
          .footer-text {
            color: #7f8c8d;
            font-size: 13px;
            line-height: 1.5;
          }
          .company-name {
            color: #cb4f30;
            font-weight: 600;
          }
          @media (max-width: 600px) {
            .container { margin: 10px; }
            .header, .content { padding: 30px 20px; }
            .reset-button { display: block; text-align: center; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            <div class="header">
              <div class="logo">🌍 Aadivaa Earth</div>
              <div class="subtitle">Connecting Communities, Nurturing Growth</div>
            </div>
            
            <div class="content">
              <div class="user-type-badge">
                ${userType === "artist"
            ? "🎨 Artist Account"
            : "🛍️ Buyer Account"}
              </div>
              
              <div class="greeting">Hello there! 👋</div>
              
              <div class="message">
                We received a request to reset the password for your Aadivaa Earth ${userType === "artist" ? "artist" : "buyer"} account. Don't worry, we've got you covered!
              </div>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">
                  🔐 Reset My Password
                </a>
              </div>
              
              <div class="link-fallback">
                <div class="link-text">
                  <strong>Button not working?</strong> Copy and paste this link into your browser:
                </div>
                <div class="url-text">${resetUrl}</div>
              </div>
              
              <div class="security-note">
                <div class="security-icon">⏰</div>
                <div class="timer-text">This link expires in 1 hour</div>
                <div style="font-size: 13px; color: #6c757d; margin-top: 8px;">
                  For your security, please use this link soon
                </div>
              </div>
              
              <div class="ignore-text">
                If you didn't request this password reset, you can safely ignore this email. 
                Your account remains secure! 🔒
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
                <div style="font-size: 14px; color: #5a6c7d;">
                  Need help? We're here for you! 💬
                </div>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-text">
                With warm regards,<br>
                <span class="company-name">The Aadivaa Earth Team</span>
              </div>
              <div style="margin-top: 15px; font-size: 12px; color: #adb5bd;">
                © 2024 Aadivaa Earth. Made with ❤️ for our community
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
// Specific function for buyer password reset
const sendBuyerForgotPasswordEmail = async (email, resetToken) => {
    return (0, exports.sendForgotPasswordEmail)(email, resetToken, "buyer");
};
exports.sendBuyerForgotPasswordEmail = sendBuyerForgotPasswordEmail;
// Specific function for artist password reset
const sendArtistForgotPasswordEmail = async (email, resetToken) => {
    return (0, exports.sendForgotPasswordEmail)(email, resetToken, "artist");
};
exports.sendArtistForgotPasswordEmail = sendArtistForgotPasswordEmail;
//# sourceMappingURL=forgotMailer.js.map