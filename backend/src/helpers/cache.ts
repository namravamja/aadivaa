// utils/cache.ts
import redis from "../config/redis";

const DEFAULT_EXPIRY = 60 * 5; // 5 minutes
const PREFIX = "aadivaa:";

const buildKey = (key: string) => `${PREFIX}${key}`;

export const setCache = async (
  key: string,
  data: any,
  expiry = DEFAULT_EXPIRY
) => {
  try {
    await redis.set(buildKey(key), JSON.stringify(data), "EX", expiry);
  } catch (e) {
    console.error("⚠️ Redis setCache error:", e);
  }
};

export const getCache = async (key: string) => {
  try {
    const data = await redis.get(buildKey(key));
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("⚠️ Redis getCache error:", e);
    return null;
  }
};

export const deleteCache = async (key: string) => {
  try {
    await redis.del(buildKey(key));
  } catch (e) {
    console.error("⚠️ Redis deleteCache error:", e);
  }
};

export const getOrSetCache = async (
  key: string,
  fetchFunction: () => Promise<any>,
  expiry = DEFAULT_EXPIRY
) => {
  const cached = await getCache(key);
  if (cached) return cached;

  const fresh = await fetchFunction();
  await setCache(key, fresh, expiry);
  return fresh;
};
