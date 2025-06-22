import type { Request, Response } from "express";
import * as buyerService from "../../services/Buyer/buyer.service";
import { getCache, setCache, deleteCache } from "../../helpers/cache";

// Assuming JWT middleware adds user object to req
interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
  file?: Express.Multer.File; // Add file property for uploaded images
}

export const createBuyer = async (req: Request, res: Response) => {
  try {
    const buyer = await buyerService.createBuyer(req.body);

    // Clear buyers list cache after creating new buyer
    await deleteCache(`buyers:all`);

    res.status(201).json(buyer);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getBuyer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized controller");

    const cacheKey = `buyer:${userId}`;
    const cachedBuyer = await getCache(cacheKey);

    if (cachedBuyer) {
      return res.json({ source: "cache", data: cachedBuyer });
    }

    const buyer = await buyerService.getBuyerById(userId);
    await setCache(cacheKey, buyer);

    res.json({ source: "db", data: buyer });
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const updateBuyer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized controller");

    // Prepare update data
    const updateData = { ...req.body };

    // If an image was uploaded, add the Cloudinary URL to update data
    if (req.file) {
      updateData.avatar = req.file.path; // Cloudinary URL is stored in file.path
    }

    const buyer = await buyerService.updateBuyer(userId, updateData);

    // Clear related caches after updating buyer
    await deleteCache(`buyer:${userId}`);
    await deleteCache(`buyers:all`);

    res.json(buyer);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteBuyer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const result = await buyerService.deleteBuyer(userId);

    // Clear related caches after deleting buyer
    await deleteCache(`buyer:${userId}`);
    await deleteCache(`buyers:all`);

    res.json(result);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const getBuyers = async (_req: Request, res: Response) => {
  try {
    const cacheKey = `buyers:all`;
    const cachedBuyers = await getCache(cacheKey);

    if (cachedBuyers) {
      return res.json({ source: "cache", data: cachedBuyers });
    }

    const buyers = await buyerService.listBuyers();
    await setCache(cacheKey, buyers);

    res.json({ source: "db", data: buyers });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
