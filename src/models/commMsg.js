const mongoose = require("mongoose");

const commMsg = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },

  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

const CommMsg = mongoose.model("CommMsg", commMsg);
module.exports = CommMsg;
