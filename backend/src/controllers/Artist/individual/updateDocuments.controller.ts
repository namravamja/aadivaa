import { Request, Response } from "express";
import * as artistService from "../../../services/Artist/artist.service";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const updateDocuments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    // Handle file uploads
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const documentsData: any = {};

    // Handle file uploads
    if (files?.gstCertificate?.[0])
      documentsData.gstCertificate = files.gstCertificate[0].path;
    if (files?.panCard?.[0]) documentsData.panCard = files.panCard[0].path;
    if (files?.businessLicense?.[0])
      documentsData.businessLicense = files.businessLicense[0].path;
    if (files?.canceledCheque?.[0])
      documentsData.canceledCheque = files.canceledCheque[0].path;

    // Also handle any non-file data from req.body if needed
    Object.keys(req.body).forEach((key) => {
      if (!documentsData[key]) {
        documentsData[key] = req.body[key];
      }
    });

    console.log("Documents data:", documentsData);
    console.log("Files received:", files);

    const updatedDocuments = await artistService.updateDocuments(
      userId,
      documentsData
    );

    res.json({
      success: true,
      message: "Documents updated successfully",
      data: updatedDocuments,
    });
  } catch (error) {
    console.error("Error updating documents:", error);
    res.status(400).json({ error: (error as Error).message });
  }
};
