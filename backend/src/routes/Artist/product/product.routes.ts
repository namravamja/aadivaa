import express from "express";
import * as productController from "../../../controllers/Artist/product/product.controller";
import { verifyToken } from "../../../middleware/authMiddleware";
import { uploadProductImages } from "../../../middleware/multer";

const router = express.Router();

router.get("/list", productController.getAllProducts as any);
router.get(
  "/listByArtistId/:artistId",
  productController.getProductsByArtistId as any
);

// Product routes
router.post(
  "/create",
  verifyToken,
  uploadProductImages,
  productController.createProduct as any
);
router.get(
  "/listByArtist",
  verifyToken,
  productController.getProductsByArtist as any
);
router.put(
  "/update/:productId",
  verifyToken,
  uploadProductImages,
  productController.updateProduct as any
);
router.delete(
  "/delete/:productId",
  verifyToken,
  productController.deleteProduct as any
);

router.get("/:productId", productController.getProductById as any);

router.patch(
  "/updateStock",
  verifyToken,
  productController.updateStockOnly as any
);
export default router;
