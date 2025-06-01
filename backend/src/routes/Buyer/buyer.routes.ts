import express from "express";
import * as buyerController from "../../controllers/Buyer/buyer.controller";
import { verifyToken } from "../../middleware/authMiddleware"; // Your JWT auth middleware
import upload from "../../middleware/multer"; // Import the multer middleware

const router = express.Router();

router.post("/create", verifyToken, buyerController.createBuyer); // Create a new buyer

router.get("/list", buyerController.getBuyers); // List all buyers

router.use(verifyToken); // All routes below require auth
// Protected routes — get, update, delete buyer info by token user id
router.get("/view", buyerController.getBuyer); // Get buyer info from token
router.put("/update", upload.single("avatar"), buyerController.updateBuyer); // Update buyer info with optional image upload
router.delete("/delete", buyerController.deleteBuyer); // Delete buyer from token

export default router;
