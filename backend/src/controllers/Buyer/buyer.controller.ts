import type { Request, Response } from "express";
import * as buyerService from "../../services/Buyer/buyer.service";

// Assuming JWT middleware adds user object to req
interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
  file?: Express.Multer.File; // Add file property for uploaded images
}

export const createBuyer = async (req: Request, res: Response) => {
  try {
    const buyer = await buyerService.createBuyer(req.body);
    res.status(201).json(buyer);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getBuyer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized controller");
    const buyer = await buyerService.getBuyerById(userId);
    res.json(buyer);
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
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const getBuyers = async (_req: Request, res: Response) => {
  try {
    const buyers = await buyerService.listBuyers();
    res.json(buyers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
