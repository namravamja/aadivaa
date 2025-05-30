import { Request, Response } from "express";
import * as artistService from "../../services/Artist/artist.service";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const createArtist = async (req: Request, res: Response) => {
  try {
    const artist = await artistService.createArtist(req.body);
    res.status(201).json(artist);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

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

export const updateArtist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized controller");
    const artist = await artistService.updateArtist(userId, req.body);
    res.json(artist);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

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

export const getArtists = async (_req: Request, res: Response) => {
  try {
    const artists = await artistService.listArtists();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
