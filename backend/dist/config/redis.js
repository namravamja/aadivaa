"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
let redis;
if (process.env.REDIS_URL) {
    redis = new ioredis_1.default(process.env.REDIS_URL, {
        tls: {}, // Required for rediss:// to enable SSL
        maxRetriesPerRequest: 5, // Optional: avoid infinite retry loop
        connectTimeout: 10000, // Optional: give Redis 10s to connect
    });
    console.log("🔌 Using Redis from REDIS_URL");
}
else {
    redis = new ioredis_1.default({
        host: "127.0.0.1",
        port: 6379,
    });
    console.log("🔌 Using Local Redis at 127.0.0.1:6379");
}
redis.on("connect", () => {
    console.log("✅ Redis connected");
});
redis.on("error", (err) => {
    console.error("❌ Redis error:", err);
});
exports.default = redis;
//# sourceMappingURL=redis.js.map