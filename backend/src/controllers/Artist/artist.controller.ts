import { Request, Response } from "express";
import * as artistService from "../../services/Artist/artist.service";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const createArtist = async (req: Request, res: Response) => {
  try {
    const artist = await artistService.createArtist(req.body);
    res.status(201).json(artist);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getArtist = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized controller");
    const artist = await artistService.getArtistById(userId);
    res.json(artist);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

// Update main artist data
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

    console.log("Update data:", updateData);
    console.log("Files received:", files);

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

// Update Business Address
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

// Update Warehouse Address
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

// Update Documents
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

// Update Social Links
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

export const deleteArtist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const result = await artistService.deleteArtist(userId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const getArtists = async (_req: Request, res: Response) => {
  try {
    const artists = await artistService.listArtists();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
