"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProductImages = exports.uploadDocuments = exports.uploadArtistImages = exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
// 🔹 Shared Cloudinary config
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
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
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed!"));
    }
};
// 🔹 Single file uploader (for Buyer etc.)
exports.uploadSingle = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
// 🔹 Multi-field uploader (for Artist) - FIXED: Added document fields
exports.uploadArtistImages = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
    { name: "businessLogo", maxCount: 1 },
    { name: "digitalSignature", maxCount: 1 },
]);
// 🔹 Document-specific uploader
exports.uploadDocuments = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
    { name: "gstCertificate", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "businessLicense", maxCount: 1 },
    { name: "canceledCheque", maxCount: 1 },
]);
exports.uploadProductImages = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).array("productImages", 10);
//# sourceMappingURL=multer.js.map