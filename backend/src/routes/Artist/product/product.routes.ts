import express from "express";
import * as productController from "../../../controllers/Artist/product/product.controller";
import { verifyToken } from "../../../middleware/authMiddleware";
import { uploadProductImages } from "../../../middleware/multer";

const router = express.Router();

router.get("/list", productController.getAllProducts);
router.get("/:productId", productController.getProductById);

router.use(verifyToken);

// Product routes
router.post("/create", uploadProductImages, productController.createProduct);
router.get("/listByArtist", productController.getProductsByArtist);
router.put(
  "/update/:productId",
  uploadProductImages,
  productController.updateProduct
);
router.delete("/delete/:productId", productController.deleteProduct);

export default router;
