const mongoose = require('mongoose');
const connectDB = require('../config/database');
// Connect to MongoDB
connectDB();

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  emailAddress: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`
    }
  },
  identityNumber: {
    type: Number,
    required: true,
    unique: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
