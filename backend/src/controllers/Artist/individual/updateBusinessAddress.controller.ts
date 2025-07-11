import { Request, Response } from "express";
import * as artistService from "../../../services/Artist/artist.service";
import { deleteCache } from "../../../helpers/cache"; // adjust this path if needed

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const updateBusinessAddress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const addressData = req.body;
    const updatedAddress = await artistService.updateBusinessAddress(
      userId,
      addressData
    );

    // Invalidate cache using helper
    await deleteCache(`artist:${userId}`);
    await deleteCache("artists:all");

    res.json({
      success: true,
      message: "Business address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating business address:", error);
    res.status(400).json({ error: (error as Error).message });
  }
};
