const mongoose = require('mongoose');

const publishImg = new mongoose.Schema({
  img: {
    url: String,
    filename: String
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const PublishImg = mongoose.model('PublishImg', publishImg);
module.exports = PublishImg;  