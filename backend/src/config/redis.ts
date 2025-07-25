import Redis from "ioredis";

let redis: Redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    tls: {}, // Required for rediss:// to enable SSL
    maxRetriesPerRequest: 5, // Optional: avoid infinite retry loop
    connectTimeout: 10000, // Optional: give Redis 10s to connect
  });
  console.log("🔌 Using Redis from REDIS_URL");
} else {
  redis = new Redis({
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

export default redis;
