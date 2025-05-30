import express from "express";
import * as artistController from "../../controllers/Artist/artist.controller";
import { verifyToken } from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/create", verifyToken, artistController.createArtist);

router.get("/list", artistController.getArtists);

router.use(verifyToken);

router.get("/view", artistController.getArtist);
router.put("/update", artistController.updateArtist);
router.delete("/delete", artistController.deleteArtist);

export default router;
