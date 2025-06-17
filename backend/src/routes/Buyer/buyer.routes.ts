import express from "express";
import * as buyerController from "../../controllers/Buyer/buyer.controller";
import * as wishlistController from "../../controllers/Buyer/wishlist/wishlist.controller";
import * as cartController from "../../controllers/Buyer/cart/cart.controller";
import * as orderController from "../../controllers/Buyer/order/order.controller";
import * as reviewController from "../../controllers/Buyer/review/review.controller";

import { verifyToken } from "../../middleware/authMiddleware";
import { uploadSingle } from "../../middleware/multer";

const router = express.Router();

// Public routes
router.post("/create", verifyToken, buyerController.createBuyer);
router.get("/list", buyerController.getBuyers);
router.get("/review/:productId", reviewController.getReviewsByProduct);

// Protected routes
router.use(verifyToken);

router.get("/view", buyerController.getBuyer as any);
router.put(
  "/update",
  uploadSingle.single("avatar"),
  buyerController.updateBuyer as any
);
router.delete("/delete", buyerController.deleteBuyer as any);

// ------------------- Wishlist Routes -------------------
router.post("/wishlist/add", wishlistController.addToWishlist as any);
router.get("/wishlist/get", wishlistController.getWishlist as any);
router.delete("/wishlist/delete", wishlistController.removeFromWishlist as any);

// ------------------- Cart Routes -------------------
router.post("/cart/add", cartController.addToCart as any);
router.get("/cart/get", cartController.getCartByBuyerId as any);
router.put("/cart/update", cartController.updateCartItem as any);
router.delete("/cart/delete", cartController.removeFromCart as any);

// ------------------- Order Routes -------------------
router.post("/order/create", orderController.createOrder as any);
router.get("/order/list", orderController.getBuyerOrders as any);
router.get("/order/:orderId", orderController.getOrderById as any);
router.put("/order/cancel/:orderId", orderController.cancelOrder as any);
router.put("/order/payment/:orderId", orderController.updatePaymentStatus);

// ------------------- Review Routes -------------------
router.post("/review/:productId", reviewController.addReview as any);
router.put("/review/update", reviewController.updateReview as any);
router.delete("/review/delete", reviewController.deleteReview as any);

export default router;
