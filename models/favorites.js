const mongoose = require('mongoose');

const favourites = new mongoose.Schema({
  img: [{
    url: String,
    filename: String
  }],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Favourites = mongoose.model('Favourites', favourites);
module.exports = Favourites;