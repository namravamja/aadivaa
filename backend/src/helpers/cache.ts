import redis from "../config/redis";

const DEFAULT_EXPIRY = 60 * 5; // 5 minutes

export const setCache = async (
  key: string,
  data: any,
  expiry = DEFAULT_EXPIRY
) => {
  await redis.set(key, JSON.stringify(data), "EX", expiry);
};

export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const deleteCache = async (key: string) => {
  await redis.del(key);
};
