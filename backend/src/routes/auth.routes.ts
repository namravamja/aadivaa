import express from "express";
import { loginBuyer, signupBuyer } from "../controllers/auth.controller";

const router = express.Router();

router.post("/buyer/signup", signupBuyer);
router.post("/buyer/login", loginBuyer);

export default router;
