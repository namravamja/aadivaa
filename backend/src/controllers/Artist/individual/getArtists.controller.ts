import { Request, Response } from "express";
import * as artistService from "../../../services/Artist/artist.service";
import { getCache, setCache } from "../../../helpers/cache";

export const getArtists = async (_req: Request, res: Response) => {
  try {
    const cacheKey = "artists:all";
    const cachedArtists = await getCache(cacheKey);

    if (cachedArtists) {
      return res.json({ source: "cache", data: cachedArtists });
    }

    const artists = await artistService.listArtists();
    await setCache(cacheKey, artists);

    res.json({ source: "db", data: artists });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
