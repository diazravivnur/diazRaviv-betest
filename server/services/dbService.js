const { User } = require('../models/User');

const findUserById = async (id) => {
  const user = await User.findById(id);

  return user;
};

module.exports = {
  findUserById
};
