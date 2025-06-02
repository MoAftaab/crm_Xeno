import express from 'express';
import Redis from 'ioredis';
import { redisClient } from '../config/redis';

const CACHE_DURATION = 3600; // 1 hour in seconds

export interface RedisError extends Error {
  code?: string;
}

interface ResponseWithCache extends express.Response {
  originalJson?: express.Response['json'];
  json: express.Response['json'];
}

export const cacheMiddleware = (
  req: express.Request,
  res: ResponseWithCache,
  next: express.NextFunction
): void => {
  const key = `cache:${req.originalUrl || req.url}`;

  redisClient.get(key).then((data: string | null) => {
    if (data !== null) {
      const cachedResponse = JSON.parse(data);
      res.json(cachedResponse);
      return;
    }
    
    // Store the original json method
    const originalJson = res.json.bind(res);
    res.originalJson = originalJson;

    // Override res.json method
    res.json = function(body: any): express.Response {
      if (res.originalJson) {
        res.originalJson(body);
      }

      // Store the response in cache
      redisClient.setex(key, CACHE_DURATION, JSON.stringify(body))
        .catch((err: RedisError) => console.error('Redis cache error:', err));

      return res;
    };

    next();
  }).catch((err: RedisError) => {
    console.error('Redis error:', err);
    next();
  });
};
