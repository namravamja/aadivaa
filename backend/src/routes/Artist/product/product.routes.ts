import express from "express";
import * as productController from "../../../controllers/Artist/product/product.controller";
import { verifyToken } from "../../../middleware/authMiddleware";
import { uploadProductImages } from "../../../middleware/multer";

const router = express.Router();

router.get("/list", productController.getAllProducts);
router.get(
  "/listByArtistId/:artistId",
  productController.getProductsByArtistId
);

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

router.patch("/updateStock", verifyToken, productController.updateStockOnly);
export default router;
