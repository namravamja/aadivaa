import { Request, Response } from "express";
import * as artistService from "../../../services/Artist/artist.service";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const updateWarehouseAddress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const addressData = req.body;
    const updatedAddress = await artistService.updateWarehouseAddress(
      userId,
      addressData
    );

    res.json({
      success: true,
      message: "Warehouse address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating warehouse address:", error);
    res.status(400).json({ error: (error as Error).message });
  }
};
