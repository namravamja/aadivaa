"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrSetCache = exports.deleteCache = exports.getCache = exports.setCache = void 0;
// utils/cache.ts
const redis_1 = __importDefault(require("../config/redis"));
const DEFAULT_EXPIRY = 60 * 5; // 5 minutes
const PREFIX = "aadivaa:";
const buildKey = (key) => `${PREFIX}${key}`;
const setCache = async (key, data, expiry = DEFAULT_EXPIRY) => {
    try {
        await redis_1.default.set(buildKey(key), JSON.stringify(data), "EX", expiry);
    }
    catch (e) {
        console.error("⚠️ Redis setCache error:", e);
    }
};
exports.setCache = setCache;
const getCache = async (key) => {
    try {
        const data = await redis_1.default.get(buildKey(key));
        return data ? JSON.parse(data) : null;
    }
    catch (e) {
        console.error("⚠️ Redis getCache error:", e);
        return null;
    }
};
exports.getCache = getCache;
const deleteCache = async (key) => {
    try {
        await redis_1.default.del(buildKey(key));
    }
    catch (e) {
        console.error("⚠️ Redis deleteCache error:", e);
    }
};
exports.deleteCache = deleteCache;
const getOrSetCache = async (key, fetchFunction, expiry = DEFAULT_EXPIRY) => {
    const cached = await (0, exports.getCache)(key);
    if (cached)
        return cached;
    const fresh = await fetchFunction();
    await (0, exports.setCache)(key, fresh, expiry);
    return fresh;
};
exports.getOrSetCache = getOrSetCache;
//# sourceMappingURL=cache.js.map