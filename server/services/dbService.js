const { User } = require('../models/User');
const CommonHelper = require('../helpers/commonHelper');

const findUserById = async (id) => {
  const user = await User.findById(id);
  CommonHelper.log('dbService.js', 'QUERY findUserById', 'Success');

  return user;
};

const findUserByAccountNumber = async (accountNumber) => {
  return User.findOne({ accountNumber });
};

const findUserByIdentityNumber = async (identityNumber) => {
  return User.findOne({ identityNumber });
};

module.exports = {
  findUserById,
  findUserByAccountNumber,
  findUserByIdentityNumber
};
