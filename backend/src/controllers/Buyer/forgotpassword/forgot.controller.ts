import { Request, Response } from "express";
import * as forgotService from "../../../services/Buyer/forgotpassword/forgot.service";
import { getCache, setCache, deleteCache } from "../../../helpers/cache";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if email has recent forgot password request (rate limiting)
    const rateLimitKey = `forgot_password_rate:${email}`;
    const recentRequest = await getCache(rateLimitKey);

    if (recentRequest) {
      return res.status(429).json({
        error: "Please wait before requesting another password reset",
      });
    }

    const result = await forgotService.forgotPassword(email);

    // Set rate limiting cache (5 minutes)
    await setCache(rateLimitKey, true, 300);

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

    const result = await forgotService.resetPassword(token, password);

    // Clear token verification cache after successful reset
    await deleteCache(`reset_token:${token}`);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const verifyResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const cacheKey = `reset_token:${token}`;
    const cachedResult = await getCache(cacheKey);

    if (cachedResult) {
      return res.status(200).json({ source: "cache", data: cachedResult });
    }

    const result = await forgotService.verifyResetToken(token);

    // Cache token verification result for 10 minutes
    await setCache(cacheKey, result, 600);

    res.status(200).json({ source: "db", data: result });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
