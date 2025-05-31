import express from "express";
import {
  loginBuyer,
  signupBuyer,
  loginArtist,
  signupArtist,
} from "../../controllers/common/auth.controller";
import { logout } from "../../controllers/common/logout.controller";

const router = express.Router();

// Buyer routes
router.post("/buyer/signup", signupBuyer);
router.post("/buyer/login", loginBuyer);

// Artist routes
router.post("/artist/signup", signupArtist);
router.post("/artist/login", loginArtist);

router.post("/logout", logout);

export default router;
