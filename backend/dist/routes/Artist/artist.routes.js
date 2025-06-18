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
const artistController = __importStar(require("../../controllers/Artist/artist.controller"));
const forgotmailController = __importStar(require("../../controllers/Artist/artist.controller"));
const artistOrderController = __importStar(require("../../controllers/Artist/order/order.controller"));
const reviewController = __importStar(require("../../controllers/Artist/review/review.controller"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const multer_1 = require("../../middleware/multer");
const router = express_1.default.Router();
// Artist routes
router.get("/list", artistController.getArtists);
// forgot password
router.post("/forgot-password", forgotmailController.forgotPassword);
router.post("/reset-password", forgotmailController.resetPassword);
router.get("/verify-reset-token/:token", forgotmailController.verifyResetToken);
router.use(authMiddleware_1.verifyToken);
router.post("/create", artistController.createArtist);
router.get("/view", artistController.getArtist);
router.put("/update", multer_1.uploadArtistImages, artistController.updateArtist);
router.put("/update/business-address", artistController.updateBusinessAddress);
router.put("/update/warehouse-address", artistController.updateWarehouseAddress);
router.put("/update/documents", multer_1.uploadDocuments, artistController.updateDocuments);
router.put("/update/social-links", artistController.updateSocialLinks);
router.delete("/delete", artistController.deleteArtist);
// ---------- order routes ----------
// Get all orders for the artist (with pagination and filtering)
router.get("/order", artistOrderController.getArtistOrders);
// Get a specific order by ID
router.get("/order/:orderId", artistOrderController.getArtistOrderById);
// Update order status (pending, shipped, delivered, cancelled)
router.put("/order/:orderId/status", artistOrderController.updateOrderStatus);
// Update payment status (unpaid, paid, failed)
router.put("/order/:orderId/payment-status", artistOrderController.updateOrderPaymentStatus);
// Get all order items for the artist (alternative view)
router.get("/order-items", artistOrderController.getOrderItemsByArtist);
// Bulk update order status for multiple orders
router.put("/order/bulk-status", artistOrderController.bulkUpdateOrderStatus);
// ---------- review routes ----------
// Get all reviews written on the artist's products
router.get("/reviews", reviewController.getReviewsByArtist);
// Update verification status of a review
router.put("/reviews/verify", reviewController.updateReviewVerificationStatus);
// Delete a review (by the artist)
router.delete("/reviews/delete", reviewController.deleteReviewByArtist);
exports.default = router;
//# sourceMappingURL=artist.routes.js.map