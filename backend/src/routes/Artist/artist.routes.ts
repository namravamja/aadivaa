import express from "express";
import * as artistController from "../../controllers/Artist/artist.controller";
import { verifyToken } from "../../middleware/authMiddleware";
import upload from "../../middleware/multer"; // Import the multer middleware

const router = express.Router();

router.post("/create", verifyToken, artistController.createArtist);

router.get("/list", artistController.getArtists);

router.use(verifyToken);

router.get("/view", artistController.getArtist);
router.put("/update", upload.single("avatar"), artistController.updateArtist);
router.delete("/delete", artistController.deleteArtist);

export default router;
