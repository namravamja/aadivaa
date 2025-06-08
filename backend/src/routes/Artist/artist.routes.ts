import express from "express";
import * as artistController from "../../controllers/Artist/artist.controller";
import * as artistOrderController from "../../controllers/Artist/order/order.controller";

import { verifyToken } from "../../middleware/authMiddleware";
import { uploadArtistImages, uploadDocuments } from "../../middleware/multer";

const router = express.Router();

// Artist routes
router.get("/list", artistController.getArtists);

router.use(verifyToken);

router.post("/create", artistController.createArtist);
router.get("/view", artistController.getArtist);
router.put("/update", uploadArtistImages, artistController.updateArtist);
router.put("/update/business-address", artistController.updateBusinessAddress);
router.put(
  "/update/warehouse-address",
  artistController.updateWarehouseAddress
);
router.put(
  "/update/documents",
  uploadDocuments,
  artistController.updateDocuments
);
router.put("/update/social-links", artistController.updateSocialLinks);
router.delete("/delete", artistController.deleteArtist);

// ---------- order routes ----------

// Get all orders for the artist (with pagination and filtering)
router.get("/order", artistOrderController.getArtistOrders);

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
router.get("/order-items", artistOrderController.getOrderItemsByArtist);

// Bulk update order status for multiple orders
router.put(
  "/order/bulk-status",
  artistOrderController.bulkUpdateOrderStatus as any
);
export default router;
