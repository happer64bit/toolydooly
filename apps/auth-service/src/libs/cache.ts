import redisClient from './redis';

export const getCache = async (key: string) => {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
};

export const setCache = async (key: string, value: any, ttlSec = 300) => {
    await redisClient.set(key, JSON.stringify(value), { EX: ttlSec });
};
