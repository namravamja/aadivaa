import { Request, Response } from "express";
import * as artistService from "../../../services/Artist/artist.service";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const deleteArtist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const result = await artistService.deleteArtist(userId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};
