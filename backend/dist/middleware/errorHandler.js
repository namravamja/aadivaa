"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = exports.asyncHandler = exports.createError = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const createError = (message, statusCode = 500) => {
    return new AppError(message, statusCode);
};
exports.createError = createError;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const notFound = (req, res, next) => {
    const error = (0, exports.createError)(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // Log error
    logger_1.logger.error(`Error ${error.statusCode || 500}: ${error.message}`);
    // Prisma errors
    if (err.name === "PrismaClientKnownRequestError") {
        const message = "Database operation failed";
        error = (0, exports.createError)(message, 400);
    }
    // Prisma validation errors
    if (err.name === "PrismaClientValidationError") {
        const message = "Invalid data provided";
        error = (0, exports.createError)(message, 400);
    }
    // JWT errors
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token";
        error = (0, exports.createError)(message, 401);
    }
    if (err.name === "TokenExpiredError") {
        const message = "Token expired";
        error = (0, exports.createError)(message, 401);
    }
    // Validation errors
    if (err.name === "ValidationError") {
        const message = "Validation failed";
        error = (0, exports.createError)(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map