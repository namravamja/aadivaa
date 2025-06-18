import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../../utils/jwt";
import crypto from "crypto";
import { sendArtistForgotPasswordEmail } from "../../../helpers/forgotMailer";

const prisma = new PrismaClient();

// Add these functions to your existing artist service

export const forgotPassword = async (email: string) => {
  const artist = await prisma.artist.findUnique({
    where: { email },
  });

  if (!artist) {
    throw new Error("No account found with this email address");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

  await prisma.artist.update({
    where: { id: artist.id },
    data: {
      forgotPasswordToken: resetToken,
      forgotPasswordExpires: resetTokenExpiry,
    },
  });

  await sendArtistForgotPasswordEmail(email, resetToken);

  return { message: "Password reset email sent successfully" };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const artist = await prisma.artist.findFirst({
    where: {
      forgotPasswordToken: token,
      forgotPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!artist) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.artist.update({
    where: { id: artist.id },
    data: {
      password: hashedPassword,
      forgotPasswordToken: null,
      forgotPasswordExpires: null,
    },
  });

  return { message: "Password reset successful" };
};

export const verifyResetToken = async (token: string) => {
  const artist = await prisma.artist.findFirst({
    where: {
      forgotPasswordToken: token,
      forgotPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!artist) {
    throw new Error("Invalid or expired reset token");
  }

  return { valid: true, email: artist.email };
};
