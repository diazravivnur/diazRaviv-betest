const { User } = require('../models/User');
const CommonHelper = require('../helpers/commonHelper');

const findUserById = async (id) => {
  const user = await User.findById(id);
  CommonHelper.log('dbService.js', 'QUERY findUserById', 'Success');

  return user;
};

module.exports = {
  findUserById
};
