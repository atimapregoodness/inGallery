const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'email cannot be blank'],
    unique: true
  },
  publishedImages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PublishImg',
  }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);