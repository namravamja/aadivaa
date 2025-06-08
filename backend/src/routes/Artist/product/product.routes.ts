import express from "express";
import * as productController from "../../../controllers/Artist/product/product.controller";
import { verifyToken } from "../../../middleware/authMiddleware";
import { uploadProductImages } from "../../../middleware/multer";

const router = express.Router();

router.get("/list", productController.getAllProducts);

// Product routes
router.post(
  "/create",
  verifyToken,
  uploadProductImages,
  productController.createProduct
);
router.get("/listByArtist", verifyToken, productController.getProductsByArtist);
router.put(
  "/update/:productId",
  verifyToken,
  uploadProductImages,
  productController.updateProduct
);
router.delete(
  "/delete/:productId",
  verifyToken,
  productController.deleteProduct
);

router.get("/:productId", productController.getProductById);
export default router;
