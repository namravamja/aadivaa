import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthPayload {
  id: string;
  role: "BUYER" | "ARTIST";
}

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as AuthPayload;

      (req as any).user = decoded;

      if (decoded.role === "BUYER") {
        await prisma.buyer.update({
          where: { id: decoded.id },
          data: { isAuthenticated: false },
        });
      } else if (decoded.role === "ARTIST") {
        await prisma.artist.update({
          where: { id: decoded.id },
          data: { isAuthenticated: false },
        });
      }
    } catch (err) {
      // Token might be expired or tampered — ignore and still clear cookie
    }
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ message: "Logged out successfully" });
};
