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
exports.updateArtist = void 0;
const artistService = __importStar(require("../../../services/Artist/artist.service"));
const updateArtist = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const updateData = {};
        const excludedFields = [
            "businessAddress",
            "warehouseAddress",
            "documents",
            "socialLinks",
        ];
        for (const key in req.body) {
            if (!excludedFields.includes(key)) {
                try {
                    if (typeof req.body[key] === "string" &&
                        (req.body[key].startsWith("{") || req.body[key].startsWith("["))) {
                        updateData[key] = JSON.parse(req.body[key]);
                    }
                    else {
                        updateData[key] = req.body[key];
                    }
                }
                catch (e) {
                    updateData[key] = req.body[key];
                }
            }
        }
        const files = req.files;
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
    }
    catch (error) {
        console.error("Error updating artist:", error);
        res.status(400).json({ error: error.message });
    }
};
exports.updateArtist = updateArtist;
//# sourceMappingURL=updateArtist.controller.js.map