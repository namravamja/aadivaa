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
exports.getArtist = void 0;
const artistService = __importStar(require("../../../services/Artist/artist.service"));
const cache_1 = require("../../../helpers/cache");
const getArtist = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized controller");
        const cacheKey = `artist:${userId}`;
        const cachedArtist = await (0, cache_1.getCache)(cacheKey);
        if (cachedArtist) {
            return res.json({ source: "cache", data: cachedArtist });
        }
        const artist = await artistService.getArtistById(userId);
        await (0, cache_1.setCache)(cacheKey, artist); // optional: set expiry
        res.json({ source: "db", data: artist });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getArtist = getArtist;
//# sourceMappingURL=getArtist.controller.js.map