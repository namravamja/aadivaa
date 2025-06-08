import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import authRoutes from "./routes/common/auth.routes";
import buyerRoutes from "./routes/Buyer/buyer.routes";
import artistRoutes from "./routes/Artist/artist.routes";
import productRouter from "./routes/Artist/product/product.routes";

// Load .env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Buyer routes
app.use("/api/buyer", buyerRoutes);

// Artist routes
app.use("/api/artist", artistRoutes);

// Product routes
app.use("/api/product", productRouter);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

// Server start
const startServer = async () => {
  try {
    // await connectDB(); // Optional: use if managing Prisma connection lifecycle

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(
        `🌐 Frontend URL: ${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }`
      );
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
