const mongoose = require('mongoose');

exports.isValidObjectId = (_id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(_id);
  const response = isValidId ? _id : '';
  return response;
};
