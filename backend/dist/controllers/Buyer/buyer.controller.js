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
exports.getBuyers = exports.deleteBuyer = exports.updateBuyer = exports.getBuyer = exports.createBuyer = void 0;
const buyerService = __importStar(require("../../services/Buyer/buyer.service"));
const cache_1 = require("../../helpers/cache");
const createBuyer = async (req, res) => {
    try {
        const buyer = await buyerService.createBuyer(req.body);
        // Clear buyers list cache after creating new buyer
        await (0, cache_1.deleteCache)(`buyers:all`);
        res.status(201).json(buyer);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createBuyer = createBuyer;
const getBuyer = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized controller");
        const cacheKey = `buyer:${userId}`;
        const cachedBuyer = await (0, cache_1.getCache)(cacheKey);
        if (cachedBuyer) {
            return res.json({ source: "cache", data: cachedBuyer });
        }
        const buyer = await buyerService.getBuyerById(userId);
        await (0, cache_1.setCache)(cacheKey, buyer);
        res.json({ source: "db", data: buyer });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getBuyer = getBuyer;
const updateBuyer = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized controller");
        // Prepare update data
        const updateData = { ...req.body };
        // If an image was uploaded, add the Cloudinary URL to update data
        if (req.file) {
            updateData.avatar = req.file.path; // Cloudinary URL is stored in file.path
        }
        const buyer = await buyerService.updateBuyer(userId, updateData);
        // Clear related caches after updating buyer
        await (0, cache_1.deleteCache)(`buyer:${userId}`);
        await (0, cache_1.deleteCache)(`buyers:all`);
        res.json(buyer);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateBuyer = updateBuyer;
const deleteBuyer = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const result = await buyerService.deleteBuyer(userId);
        // Clear related caches after deleting buyer
        await (0, cache_1.deleteCache)(`buyer:${userId}`);
        await (0, cache_1.deleteCache)(`buyers:all`);
        res.json(result);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.deleteBuyer = deleteBuyer;
const getBuyers = async (_req, res) => {
    try {
        const cacheKey = `buyers:all`;
        const cachedBuyers = await (0, cache_1.getCache)(cacheKey);
        if (cachedBuyers) {
            return res.json({ source: "cache", data: cachedBuyers });
        }
        const buyers = await buyerService.listBuyers();
        await (0, cache_1.setCache)(cacheKey, buyers);
        res.json({ source: "db", data: buyers });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBuyers = getBuyers;
//# sourceMappingURL=buyer.controller.js.map