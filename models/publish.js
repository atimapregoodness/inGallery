const mongoose = require('mongoose');

const publishImg = new mongoose.Schema({
  imgs: [{
    url: String,
    filename: String,
  }],
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const PublishImg = mongoose.model('PublishImg', publishImg);
module.exports = PublishImg;  