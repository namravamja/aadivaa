"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const auth_routes_1 = __importDefault(require("./routes/common/auth.routes"));
const buyer_routes_1 = __importDefault(require("./routes/Buyer/buyer.routes"));
const artist_routes_1 = __importDefault(require("./routes/Artist/artist.routes"));
const product_routes_1 = __importDefault(require("./routes/Artist/product/product.routes"));
// Load .env variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.set("trust proxy", 1);
// Security middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);
// Body Parsing
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Health check
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});
// Auth routes
app.use("/api/auth", auth_routes_1.default);
// Buyer routes
app.use("/api/buyer", buyer_routes_1.default);
// Artist routes
app.use("/api/artist", artist_routes_1.default);
// Product routes
app.use("/api/product", product_routes_1.default);
// 404 and error handlers
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
// Server start
const startServer = async () => {
    try {
        // await connectDB(); // Optional: use if managing Prisma connection lifecycle
        app.listen(PORT, () => {
            logger_1.logger.info(`🚀 Server running on port ${PORT}`);
            logger_1.logger.info(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
            logger_1.logger.info(`🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
        });
    }
    catch (error) {
        logger_1.logger.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map