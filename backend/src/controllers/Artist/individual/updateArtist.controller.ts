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

    // Create a new update data object
    const updateData: any = {};

    // Exclude nested objects that now have separate routes
    const excludedFields = [
      "businessAddress",
      "warehouseAddress",
      "documents",
      "socialLinks",
    ];

    // Copy all fields from the request body except excluded ones
    for (const key in req.body) {
      if (!excludedFields.includes(key)) {
        try {
          // Try to parse JSON strings (for objects and arrays)
          if (
            typeof req.body[key] === "string" &&
            (req.body[key].startsWith("{") || req.body[key].startsWith("["))
          ) {
            updateData[key] = JSON.parse(req.body[key]);
          } else {
            updateData[key] = req.body[key];
          }
        } catch (e) {
          // If parsing fails, use the original value
          updateData[key] = req.body[key];
        }
      }
    }

    // Handle file uploads if present (only for artist main fields)
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (files?.avatar?.[0]) updateData.avatar = files.avatar[0].path;
    if (files?.businessLogo?.[0])
      updateData.businessLogo = files.businessLogo[0].path;
    if (files?.digitalSignature?.[0])
      updateData.digitalSignature = files.digitalSignature[0].path;

    // console.log("Update data:", updateData);
    // console.log("Files received:", files);

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
