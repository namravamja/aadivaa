"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCache = exports.getCache = exports.setCache = void 0;
const redis_1 = __importDefault(require("../config/redis"));
const DEFAULT_EXPIRY = 60 * 5; // 5 minutes
const setCache = async (key, data, expiry = DEFAULT_EXPIRY) => {
    await redis_1.default.set(key, JSON.stringify(data), "EX", expiry);
};
exports.setCache = setCache;
const getCache = async (key) => {
    const data = await redis_1.default.get(key);
    return data ? JSON.parse(data) : null;
};
exports.getCache = getCache;
const deleteCache = async (key) => {
    await redis_1.default.del(key);
};
exports.deleteCache = deleteCache;
//# sourceMappingURL=cache.js.map