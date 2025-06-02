import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = new Redis(REDIS_URL, {
  retryStrategy: (times: number) => {
    // Exponential backoff with max 3 seconds
    const delay = Math.min(times * 50, 3000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redisClient.on('error', (err: Error) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

export default redisClient;
