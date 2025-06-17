import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";

// 🔹 Shared Cloudinary config with support for all image formats
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fileField = file.fieldname; // avatar, businessLogo, productImages, etc.
    return {
      folder: `aadivaa/artist`, // Organize in artist folder
      resource_type: "image",
      // Support all major image formats
      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
        "svg",
        "tiff",
        "tif",
        "ico",
        "avif",
        "heic",
        "heif",
        "raw",
        "cr2",
        "nef",
        "orf",
        "sr2",
      ],
      transformation: [
        {
          width: 1200,
          height: 1200,
          crop: "limit",
          quality: "auto:good",
          format: "auto", // Auto-optimize format (WebP when supported)
        },
      ],
      public_id: `${fileField}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}`, // Unique per field with random suffix
    };
  },
});

// 🔹 Enhanced file filter that accepts all image formats
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // List of supported MIME types for images
  const allowedMimeTypes = [
    // Standard formats
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
    "image/tiff",
    "image/x-icon",
    "image/vnd.microsoft.icon",
    // Modern formats
    "image/avif",
    "image/heic",
    "image/heif",
    // Raw formats (some browsers may support)
    "image/x-canon-cr2",
    "image/x-canon-crw",
    "image/x-nikon-nef",
    "image/x-sony-arw",
    "image/x-adobe-dng",
    "image/x-panasonic-raw",
    "image/x-olympus-orf",
    "image/x-fuji-raf",
    "image/x-kodak-dcr",
    "image/x-sigma-x3f",
  ];

  // Check if it's an image by MIME type
  if (
    allowedMimeTypes.includes(file.mimetype) ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file format: ${file.mimetype}. Please upload an image file.`
      )
    );
  }
};

// 🔹 Enhanced configuration options
const multerConfig = {
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Increased to 10MB for high-quality images
    files: 20, // Maximum number of files
  },
};

// 🔹 Single file uploader (for Buyer etc.)
export const uploadSingle = multer(multerConfig);

// 🔹 Multi-field uploader (for Artist) - Supports all image formats
export const uploadArtistImages = multer(multerConfig).fields([
  { name: "businessLogo", maxCount: 1 },
  { name: "digitalSignature", maxCount: 1 },
]);

// 🔹 Document-specific uploader - Enhanced for various image formats
export const uploadDocuments = multer(multerConfig).fields([
  { name: "gstCertificate", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "businessLicense", maxCount: 1 },
  { name: "canceledCheque", maxCount: 1 },
]);

// 🔹 Product images uploader - Enhanced for all formats with higher limits
export const uploadProductImages = multer({
  ...multerConfig,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB for product images (higher quality needed)
    files: 15, // Allow up to 15 product images
  },
}).array("productImages", 15);

// 🔹 Flexible uploader that can handle any field name with image uploads
export const uploadFlexibleImages = (
  fieldConfigs: Array<{ name: string; maxCount: number }>
) => {
  return multer(multerConfig).fields(fieldConfigs);
};

// 🔹 Multiple files uploader for any field
export const uploadMultipleImages = (
  fieldName: string,
  maxCount: number = 10
) => {
  return multer({
    ...multerConfig,
    limits: {
      fileSize: 12 * 1024 * 1024, // 12MB
      files: maxCount,
    },
  }).array(fieldName, maxCount);
};

// 🔹 Utility function to validate image file extension (additional client-side validation)
export const isValidImageExtension = (filename: string): boolean => {
  const validExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
    ".tiff",
    ".tif",
    ".ico",
    ".avif",
    ".heic",
    ".heif",
    ".cr2",
    ".nef",
    ".orf",
    ".sr2",
    ".arw",
    ".dng",
    ".raf",
  ];

  const fileExtension = filename
    .toLowerCase()
    .substring(filename.lastIndexOf("."));
  return validExtensions.includes(fileExtension);
};

// 🔹 Error handler middleware for multer errors
export const handleMulterError = (
  error: any,
  req: any,
  res: any,
  next: any
) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "File size too large. Maximum size allowed is 15MB.",
        });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message: "Too many files. Maximum files allowed exceeded.",
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Unexpected file field. Please check the field name.",
        });
      default:
        return res.status(400).json({
          success: false,
          message: `Upload error: ${error.message}`,
        });
    }
  }

  if (error.message.includes("Unsupported file format")) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
};
