import express from "express";
import * as artistController from "../../controllers/Artist/artist.controller";
import { verifyToken } from "../../middleware/authMiddleware";
import { uploadArtistImages } from "../../middleware/multer"; // Import the multer middleware

const router = express.Router();

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
  uploadArtistImages,
  artistController.updateDocuments
);
router.put("/update/social-links", artistController.updateSocialLinks);
router.delete("/delete", artistController.deleteArtist);

export default router;
