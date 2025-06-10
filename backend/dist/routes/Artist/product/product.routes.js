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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController = __importStar(require("../../../controllers/Artist/product/product.controller"));
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const multer_1 = require("../../../middleware/multer");
const router = express_1.default.Router();
router.get("/list", productController.getAllProducts);
router.get("/listByArtistId/:artistId", productController.getProductsByArtistId);
// Product routes
router.post("/create", authMiddleware_1.verifyToken, multer_1.uploadProductImages, productController.createProduct);
router.get("/listByArtist", authMiddleware_1.verifyToken, productController.getProductsByArtist);
router.put("/update/:productId", authMiddleware_1.verifyToken, multer_1.uploadProductImages, productController.updateProduct);
router.delete("/delete/:productId", authMiddleware_1.verifyToken, productController.deleteProduct);
router.get("/:productId", productController.getProductById);
exports.default = router;
//# sourceMappingURL=product.routes.js.map