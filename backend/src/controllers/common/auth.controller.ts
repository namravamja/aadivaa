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
      secure: true,
      sameSite: "none",
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
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: "Login artist successful" });
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
};
