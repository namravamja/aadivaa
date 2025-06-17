import express from "express";
import * as artistController from "../../controllers/Artist/artist.controller";
import * as artistOrderController from "../../controllers/Artist/order/order.controller";
import * as reviewController from "../../controllers/Artist/review/review.controller";

import { verifyToken } from "../../middleware/authMiddleware";
import { uploadArtistImages, uploadDocuments } from "../../middleware/multer";

const router = express.Router();

// Artist routes
router.get("/list", artistController.getArtists);

router.use(verifyToken);

router.post("/create", artistController.createArtist);
router.get("/view", artistController.getArtist as any);
router.put("/update", uploadArtistImages, artistController.updateArtist as any);
router.put(
  "/update/business-address",
  artistController.updateBusinessAddress as any
);
router.put(
  "/update/warehouse-address",
  artistController.updateWarehouseAddress as any
);
router.put(
  "/update/documents",
  uploadDocuments,
  artistController.updateDocuments as any
);
router.put("/update/social-links", artistController.updateSocialLinks as any);
router.delete("/delete", artistController.deleteArtist as any);

// ---------- order routes ----------

// Get all orders for the artist (with pagination and filtering)
router.get("/order", artistOrderController.getArtistOrders as any);

// Get a specific order by ID
router.get("/order/:orderId", artistOrderController.getArtistOrderById as any);

// Update order status (pending, shipped, delivered, cancelled)
router.put(
  "/order/:orderId/status",
  artistOrderController.updateOrderStatus as any
);

// Update payment status (unpaid, paid, failed)
router.put(
  "/order/:orderId/payment-status",
  artistOrderController.updateOrderPaymentStatus as any
);

// Get all order items for the artist (alternative view)
router.get("/order-items", artistOrderController.getOrderItemsByArtist as any);

// Bulk update order status for multiple orders
router.put(
  "/order/bulk-status",
  artistOrderController.bulkUpdateOrderStatus as any
);

// ---------- review routes ----------

// Get all reviews written on the artist's products
router.get("/reviews", reviewController.getReviewsByArtist as any);

// Update verification status of a review
router.put(
  "/reviews/verify",
  reviewController.updateReviewVerificationStatus as any
);

// Delete a review (by the artist)
router.delete("/reviews/delete", reviewController.deleteReviewByArtist as any);
export default router;
