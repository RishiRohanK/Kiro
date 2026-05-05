import Redis from 'ioredis';

const getRedisUrl = () => {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;
  return "redis://127.0.0.1:6379";
};

export const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => {
  console.error('Redis synchronization failure:', err);
});

export default redis;

/**
 * Common Cache Logic
 */
export async function cacheData(key: string, data: any, expirationInSeconds = 300) {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(data), 'EX', expirationInSeconds);
  } catch (err) {
    console.warn('Cache write inhibited');
  }
}

export async function getCachedData(key: string) {
  if (!redis) return null;
  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.warn('Cache read inhibited');
    return null;
  }
}
