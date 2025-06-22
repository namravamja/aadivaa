import { Request, Response } from "express";
import * as artistService from "../../../services/Artist/artist.service";
import { deleteCache } from "../../../helpers/cache";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const createArtist = async (req: Request, res: Response) => {
  try {
    const artist = await artistService.createArtist(req.body);

    // Invalidate artist-related cache keys
    await deleteCache("artists:all");

    res.status(201).json(artist);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
