import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";

// 🔹 Shared Cloudinary config
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fileField = file.fieldname; // avatar, businessLogo, etc.
    return {
      folder: `aadivaa/artist`, // Organize in artist folder
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 800, height: 800, crop: "limit" }],
      public_id: `${fileField}-${Date.now()}`, // Unique per field
    };
  },
});

// 🔹 File filter (optional: improves UX by rejecting invalid files)
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// 🔹 Single file uploader (for Buyer etc.)
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 🔹 Multi-field uploader (for Artist) - FIXED: Added document fields
export const uploadArtistImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "avatar", maxCount: 1 },
  { name: "businessLogo", maxCount: 1 },
  { name: "digitalSignature", maxCount: 1 },
  // ADD DOCUMENT FIELDS
  { name: "gstCertificate", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "businessLicense", maxCount: 1 },
  { name: "canceledCheque", maxCount: 1 },
]);

// 🔹 Document-specific uploader
export const uploadDocuments = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "gstCertificate", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "businessLicense", maxCount: 1 },
  { name: "canceledCheque", maxCount: 1 },
]);

export const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).array("productImages", 10);
