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
  views: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
});

const PublishImg = mongoose.model('PublishImg', publishImg);
module.exports = PublishImg;  