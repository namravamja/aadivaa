"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocuments = void 0;
const artistService = __importStar(require("../../../services/Artist/artist.service"));
const updateDocuments = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        // Handle file uploads
        const files = req.files;
        const documentsData = {};
        // Handle file uploads
        if (files?.gstCertificate?.[0])
            documentsData.gstCertificate = files.gstCertificate[0].path;
        if (files?.panCard?.[0])
            documentsData.panCard = files.panCard[0].path;
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
        // console.log("Documents data:", documentsData);
        // console.log("Files received:", files);
        const updatedDocuments = await artistService.updateDocuments(userId, documentsData);
        res.json({
            success: true,
            message: "Documents updated successfully",
            data: updatedDocuments,
        });
    }
    catch (error) {
        console.error("Error updating documents:", error);
        res.status(400).json({ error: error.message });
    }
};
exports.updateDocuments = updateDocuments;
//# sourceMappingURL=updateDocuments.controller.js.map