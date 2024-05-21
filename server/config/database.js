const mongoose = require('mongoose');
const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || 27017;
const CommonHelper = require('../helpers/commonHelper');

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/userdb`);
    CommonHelper.log(['MongoDB'], 'Connection connected');
  } catch (error) {
    CommonHelper.log(['MongoDB'], 'Connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
