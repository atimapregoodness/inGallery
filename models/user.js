const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'email cannot be blank'],
    unique: true
  },
  uploadedImages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadImg',
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'favorites',
  }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);