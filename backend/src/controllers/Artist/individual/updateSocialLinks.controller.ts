import { Request, Response } from "express";
import * as artistService from "../../../services/Artist/artist.service";
import { deleteCache } from "../../../helpers/cache";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const updateSocialLinks = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const socialLinksData = req.body;
    const updatedSocialLinks = await artistService.updateSocialLinks(
      userId,
      socialLinksData
    );

    await deleteCache("artists:all");

    res.json({
      success: true,
      message: "Social links updated successfully",
      data: updatedSocialLinks,
    });
  } catch (error) {
    console.error("Error updating social links:", error);
    res.status(400).json({ error: (error as Error).message });
  }
};
