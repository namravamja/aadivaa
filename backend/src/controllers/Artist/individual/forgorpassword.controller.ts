import { Request, Response } from "express";
import * as forgotmailService from "../../../services/Artist/artist.service";
import { deleteCache } from "../../../helpers/cache";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const result = await forgotmailService.forgotPassword(email);

    // Optional: Invalidate token if already exists
    await deleteCache(`resetToken:${email}`);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const result = await forgotmailService.resetPassword(token, password);

    // Optional: Delete the used token
    await deleteCache(`resetToken:${token}`);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const verifyResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const result = await forgotmailService.verifyResetToken(token);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
