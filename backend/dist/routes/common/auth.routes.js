"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controllers/common/auth.controller");
const logout_controller_1 = require("../../controllers/common/logout.controller");
const verifymail_controller_1 = require("../../controllers/common/verifymail.controller");
const router = express_1.default.Router();
// Buyer routes
router.post("/buyer/signup", auth_controller_1.signupBuyer);
router.post("/buyer/login", auth_controller_1.loginBuyer);
// Artist routes
router.post("/artist/signup", auth_controller_1.signupArtist);
router.post("/artist/login", auth_controller_1.loginArtist);
// Verification routes
router.get("/verify-email", verifymail_controller_1.verifyEmail);
router.post("/logout", logout_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map