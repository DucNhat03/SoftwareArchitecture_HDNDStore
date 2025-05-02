const redis = require('redis');
const { promisify } = require('util');

// Redis connection config
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

// Create a real Redis client
console.log('=== Redis Service ===');
console.log(`Connecting to Redis server at ${REDIS_HOST}:${REDIS_PORT}`);
console.log('=====================');

const client = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
  password: REDIS_PASSWORD || undefined
});

// Connect to Redis
(async () => {
  try {
    await client.connect();
    console.log('✅ Successfully connected to Redis server');
  } catch (err) {
    console.error('❌ Redis connection error:', err);
    process.exit(1);
  }
})();

// Handle Redis errors
client.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

client.on('reconnecting', () => {
  console.log('⏳ Redis reconnecting...');
});

client.on('ready', () => {
  console.log('✅ Redis ready');
});

// Create promisified functions for Redis operations
const getAsync = async (key) => {
  return await client.get(key);
};

const setAsync = async (key, value, expType, expValue) => {
  let result;
  if (expType === 'EX') {
    result = await client.set(key, value, { EX: expValue });
  } else {
    result = await client.set(key, value);
  }
  return result;
};

const delAsync = async (key) => {
  return await client.del(key);
};

const existsAsync = async (key) => {
  return await client.exists(key);
};

const incrAsync = async (key) => {
  return await client.incr(key);
};

const expireAsync = async (key, seconds) => {
  return await client.expire(key, seconds);
};

const keysAsync = async (pattern) => {
  return await client.keys(pattern);
};

const flushallAsync = async () => {
  return await client.flushAll();
};

// Export Redis functions
module.exports = {
  client,
  getAsync,
  setAsync,
  delAsync,
  existsAsync,
  incrAsync,
  expireAsync,
  keysAsync,
  flushallAsync
};