import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Redis Cloud configuration
const redisConfig = {
  username: 'default',
  password: 'EeCYciJ5dXxxn6yyd4cUHhNWkACQS5KA',
  socket: {
    host: 'redis-14944.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 14944
  }
};

let redisClient: any = null;
let isRedisEnabled = process.env.ENABLE_REDIS !== 'false'; // Enable by default unless explicitly disabled

// Only create the Redis client if it's enabled
if (isRedisEnabled) {
  redisClient = createClient(redisConfig);

  redisClient.on('error', (err: Error) => console.error('Redis Client Error:', err));
}

const connectRedis = async (): Promise<void> => {
  // Skip Redis connection if it's disabled
  if (!isRedisEnabled) {
    console.log('Redis is disabled, skipping connection');
    return;
  }
  
  try {
    await redisClient.connect();
    console.log('Redis Cloud connected successfully');
  } catch (error) {
    console.error('Redis connection error:', error);
    // Don't fail the application if Redis fails to connect
    console.log('Continuing without Redis');
    isRedisEnabled = false;
  }
};

export { redisClient, connectRedis, isRedisEnabled }; 