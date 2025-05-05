const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  twoFactorCode: {
    type: String,
    default: null
  },
  twoFactorExpire: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('User', userSchema);


