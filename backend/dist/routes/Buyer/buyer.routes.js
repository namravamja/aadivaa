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
const buyerController = __importStar(require("../../controllers/Buyer/buyer.controller"));
const wishlistController = __importStar(require("../../controllers/Buyer/wishlist/wishlist.controller"));
const cartController = __importStar(require("../../controllers/Buyer/cart/cart.controller"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const orderController = __importStar(require("../../controllers/Buyer/order/order.controller"));
const multer_1 = require("../../middleware/multer");
const router = express_1.default.Router();
// Public route
router.post("/create", authMiddleware_1.verifyToken, buyerController.createBuyer);
router.get("/list", buyerController.getBuyers);
// Protected routes
router.use(authMiddleware_1.verifyToken);
router.get("/view", buyerController.getBuyer);
router.put("/update", multer_1.uploadSingle.single("avatar"), buyerController.updateBuyer);
router.delete("/delete", buyerController.deleteBuyer);
// ------------------- Wishlist Routes -------------------
router.post("/wishlist/add", wishlistController.addToWishlist);
router.get("/wishlist/get", wishlistController.getWishlist);
router.delete("/wishlist/delete", wishlistController.removeFromWishlist);
// ------------------- Cart Routes -------------------
router.post("/cart/add", cartController.addToCart);
router.get("/cart/get", cartController.getCartByBuyerId);
router.put("/cart/update", cartController.updateCartItem);
router.delete("/cart/delete", cartController.removeFromCart);
// ------------------- Order Routes -------------------
router.post("/order/create", orderController.createOrder);
router.get("/order/list", orderController.getBuyerOrders);
router.get("/order/:orderId", orderController.getOrderById);
router.put("/order/cancel/:orderId", orderController.cancelOrder);
router.put("/order/payment/:orderId", orderController.updatePaymentStatus);
exports.default = router;
//# sourceMappingURL=buyer.routes.js.map