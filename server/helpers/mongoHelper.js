const mongoose = require('mongoose');

exports.isValidObjectId = (_id) => {
  return mongoose.Types.ObjectId.isValid(_id);
};
