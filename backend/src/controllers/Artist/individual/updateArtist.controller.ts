import { Request, Response } from "express";
import * as artistService from "../../../services/Artist/artist.service";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const updateArtist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const updateData: any = {};

    const excludedFields = [
      "businessAddress",
      "warehouseAddress",
      "documents",
      "socialLinks",
    ];

    for (const key in req.body) {
      if (!excludedFields.includes(key)) {
        try {
          if (
            typeof req.body[key] === "string" &&
            (req.body[key].startsWith("{") || req.body[key].startsWith("["))
          ) {
            updateData[key] = JSON.parse(req.body[key]);
          } else {
            updateData[key] = req.body[key];
          }
        } catch (e) {
          updateData[key] = req.body[key];
        }
      }
    }

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (files?.digitalSignature?.[0]) {
      updateData.digitalSignature = files.digitalSignature[0].path;
    }

    // ✅ Add this block to support business logo
    if (files?.businessLogo?.[0]) {
      updateData.businessLogo = files.businessLogo[0].path;
    }

    const artist = await artistService.updateArtistMain(userId, updateData);
    res.json({
      success: true,
      message: "Artist updated successfully",
      data: artist,
    });
  } catch (error) {
    console.error("Error updating artist:", error);
    res.status(400).json({ error: (error as Error).message });
  }
};
