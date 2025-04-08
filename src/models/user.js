const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email cannot be blank'],
    unique: true,
  },
  uploadedImages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadImg',
  }],
  publishedImages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PublishImg',
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'favorites',
  }],
  wallet: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'wallet',
  }],
  createdAt: { type: Date, default: Date.now },
});

// Disable default username requirement
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'username', // Default login field
  errorMessages: {
    IncorrectPasswordError: 'Incorrect password',
    IncorrectUsernameError: 'User not found',
    MissingUsernameError: 'Username or email is required',
    UserExistsError: 'A user with the given username or email already exists',
  },
});

module.exports = mongoose.model('User', userSchema);
