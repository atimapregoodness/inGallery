const mongoose = require('mongoose');

const uploadImg = new mongoose.Schema({
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

  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  createdAt: { type: Date, default: Date.now },
});

const UploadImg = mongoose.model('UploadImg', uploadImg);
module.exports = UploadImg;  