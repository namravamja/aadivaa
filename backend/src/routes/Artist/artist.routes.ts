import express from "express";
import * as artistController from "../../controllers/Artist/artist.controller";
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

export default router;
