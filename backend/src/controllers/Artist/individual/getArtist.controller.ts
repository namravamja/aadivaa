import { Request, Response } from "express";
import * as artistService from "../../../services/Artist/artist.service";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const getArtist = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized controller");
    const artist = await artistService.getArtistById(userId);
    res.json(artist);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};
