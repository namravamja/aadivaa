import express from "express";
import * as buyerController from "../../controllers/Buyer/buyer.controller";
import * as wishlistController from "../../controllers/Buyer/wishlist/wishlist.controller";
import * as cartController from "../../controllers/Buyer/cart/cart.controller";
import { verifyToken } from "../../middleware/authMiddleware";
import { uploadSingle } from "../../middleware/multer";

const router = express.Router();

// Public route
router.post("/create", verifyToken, buyerController.createBuyer);
router.get("/list", buyerController.getBuyers);

// Protected routes
router.use(verifyToken);

router.get("/view", buyerController.getBuyer);
router.put(
  "/update",
  uploadSingle.single("avatar"),
  buyerController.updateBuyer
);
router.delete("/delete", buyerController.deleteBuyer);

// ------------------- Wishlist Routes -------------------
router.post("/wishlist/add", wishlistController.addToWishlist);
router.get("/wishlist/get", wishlistController.getWishlist);
router.delete("/wishlist/delete", wishlistController.removeFromWishlist);

// ------------------- Cart Routes -------------------
router.post("/cart/add", cartController.addToCart);
router.get("/cart/get", cartController.getCart);
router.put("/cart/update", cartController.updateCartItem);
router.delete("/cart/delete", cartController.removeFromCart);

export default router;
