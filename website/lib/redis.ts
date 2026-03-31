import Redis from 'ioredis';

const getRedisUrl = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL;
    }
    return 'redis://localhost:6379';
};

export const redis = new Redis(getRedisUrl(), {
    lazyConnect: true,
    maxRetriesPerRequest: 0,
    retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 50, 2000);
    },
});

redis.on('error', (err) => {
    // Suppress infinite ECONNREFUSED spam 
});
