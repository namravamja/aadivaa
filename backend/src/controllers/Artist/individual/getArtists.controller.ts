import { Request, Response } from "express";
import * as artistService from "../../../services/Artist/artist.service";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const getArtists = async (_req: Request, res: Response) => {
  try {
    const artists = await artistService.listArtists();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
