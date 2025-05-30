import express from "express";
import {
  loginBuyer,
  signupBuyer,
  loginArtist,
  signupArtist,
  logout,
} from "../../controllers/common/auth.controller";

const router = express.Router();

// Buyer routes
router.post("/buyer/signup", signupBuyer);
router.post("/buyer/login", loginBuyer);

// Artist routes
router.post("/artist/signup", signupArtist);
router.post("/artist/login", loginArtist);

router.post("/logout", logout);

export default router;
