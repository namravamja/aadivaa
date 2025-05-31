import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

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
