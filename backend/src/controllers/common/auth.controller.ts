import { Request, Response } from "express";
import * as authService from "../../services/common/auth.service";

export const signupBuyer = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupBuyer(req.body);
    res.status(201).json(result);
    res.json({ message: "Signup buyer successful" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const loginBuyer = async (req: Request, res: Response) => {
  try {
    const { token } = await authService.loginBuyer(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login buyer successful" });
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
};

export const signupArtist = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupArtist(req.body);
    res.json({ message: "Signup artist successful" });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const loginArtist = async (req: Request, res: Response) => {
  try {
    const { token } = await authService.loginArtist(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: "Login artist successful" });
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
};

// export const logout = (req: Request, res: Response) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   });
//   res.json({ message: "Logged out successfully" });
// };

import { verifyVerificationToken } from "../../utils/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token || typeof token !== "string") {
    res.status(400).json({ error: "Verification token is required" });
    return;
  }

  try {
    const payload = verifyVerificationToken(token);

    if (payload.role === "BUYER") {
      const buyer = await prisma.buyer.findUnique({
        where: { id: payload.id },
      });

      if (!buyer || buyer.isVerified) {
        return res
          .status(400)
          .json({ error: "Invalid or already verified token" });
      }

      if (buyer.verifyToken !== token || buyer.verifyExpires! < new Date()) {
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
    } else if (payload.role === "ARTIST") {
      const artist = await prisma.artist.findUnique({
        where: { id: payload.id },
      });

      if (!artist || artist.isVerified) {
        return res
          .status(400)
          .json({ error: "Invalid or already verified token" });
      }

      if (artist.verifyToken !== token || artist.verifyExpires! < new Date()) {
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
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};
