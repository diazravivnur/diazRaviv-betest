const Redis = require('ioredis');
const redisClient = new Redis();
const dotenv = require('dotenv');
const CommonHelper = require('../helpers/commonHelper');
dotenv.config();

const REDIS_EXPIRY_DURATION = process.env.REDIS_EXPIRY_DURATION || 2;



// Set data to Redis with an expiry time
const setDataRedis = async (key, value, expiry = REDIS_EXPIRY_DURATION) => {
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', expiry);
    CommonHelper.log('redisService.js', 'SET', 'Success');
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

// Get data from Redis
const getDataRedis = async (key) => {
  try {
    const data = await redisClient.get(key);
    CommonHelper.log('redisService.js', 'GET', 'Success');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
};

module.exports = {
  setDataRedis,
  getDataRedis
};
