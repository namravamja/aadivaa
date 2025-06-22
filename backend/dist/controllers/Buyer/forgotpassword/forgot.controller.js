"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResetToken = exports.resetPassword = exports.forgotPassword = void 0;
const forgotService = __importStar(require("../../../services/Buyer/forgotpassword/forgot.service"));
const cache_1 = require("../../../helpers/cache");
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        // Check if email has recent forgot password request (rate limiting)
        const rateLimitKey = `forgot_password_rate:${email}`;
        const recentRequest = await (0, cache_1.getCache)(rateLimitKey);
        if (recentRequest) {
            return res.status(429).json({
                error: "Please wait before requesting another password reset",
            });
        }
        const result = await forgotService.forgotPassword(email);
        // Set rate limiting cache (5 minutes)
        await (0, cache_1.setCache)(rateLimitKey, true, 300);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ error: "Token and password are required" });
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: "Password must be at least 6 characters" });
        }
        const result = await forgotService.resetPassword(token, password);
        // Clear token verification cache after successful reset
        await (0, cache_1.deleteCache)(`reset_token:${token}`);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.resetPassword = resetPassword;
const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        const cacheKey = `reset_token:${token}`;
        const cachedResult = await (0, cache_1.getCache)(cacheKey);
        if (cachedResult) {
            return res.status(200).json({ source: "cache", data: cachedResult });
        }
        const result = await forgotService.verifyResetToken(token);
        // Cache token verification result for 10 minutes
        await (0, cache_1.setCache)(cacheKey, result, 600);
        res.status(200).json({ source: "db", data: result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.verifyResetToken = verifyResetToken;
//# sourceMappingURL=forgot.controller.js.map