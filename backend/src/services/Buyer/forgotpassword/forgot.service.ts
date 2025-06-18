import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../../../utils/jwt";
import crypto from "crypto";
import { sendBuyerForgotPasswordEmail } from "../../../helpers/forgotMailer";

const prisma = new PrismaClient();

export const forgotPassword = async (email: string) => {
  const buyer = await prisma.buyer.findUnique({
    where: { email },
  });

  if (!buyer) {
    throw new Error("No account found with this email address");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
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
  await sendBuyerForgotPasswordEmail(email, resetToken);

  return { message: "Password reset email sent successfully" };
};

export const resetPassword = async (token: string, newPassword: string) => {
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

  const hashedPassword = await hashPassword(newPassword);

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

export const verifyResetToken = async (token: string) => {
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
