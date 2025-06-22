import { Request, Response } from "express";
import * as artistService from "../../../services/Artist/artist.service";
import { getCache, setCache } from "../../../helpers/cache";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const getArtist = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized controller");

    const cacheKey = `artist:${userId}`;
    const cachedArtist = await getCache(cacheKey);

    if (cachedArtist) {
      return res.json({ source: "cache", data: cachedArtist });
    }

    const artist = await artistService.getArtistById(userId);
    await setCache(cacheKey, artist); // optional: set expiry

    res.json({ source: "db", data: artist });
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};
