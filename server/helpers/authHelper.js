const dbService = require('../services/dbService');
const redisService = require('../services/redisService');

exports.getUserData = async (id) => {
  const cachedUser = await redisService.getDataRedis(`user_data_cache_${id}`);
  if (cachedUser) {
    return cachedUser;
  }

  const user = await dbService.findUserById(id);
  if (user) {
    await redisService.setDataRedis(`user_data_cache_${id}`, user);
  }

  return user;
};
