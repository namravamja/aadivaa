import express from "express";
import * as artistController from "../../controllers/Artist/artist.controller";
import * as productController from "../../controllers/Artist/product/product.controller";
import { verifyToken } from "../../middleware/authMiddleware";
import {
  uploadArtistImages,
  uploadDocuments,
  uploadProductImages,
} from "../../middleware/multer";

const router = express.Router();

// Artist routes
router.post("/create", verifyToken, artistController.createArtist);
router.get("/list", artistController.getArtists);

router.use(verifyToken);

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

// Product routes
router.post(
  "/product/create",
  uploadProductImages,
  productController.createProduct
);
router.put(
  "/product/update/:productId",
  uploadProductImages,
  productController.updateProduct
);
router.get("/product/list", productController.getAllProducts);
router.get("/product/ArtistProduct", productController.getProductsByArtist);
router.get("/product/:productId", productController.getProductById);

export default router;
