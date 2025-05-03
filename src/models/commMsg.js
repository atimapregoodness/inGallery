const mongoose = require("mongoose");

const commMsg = new mongoose.Schema({
  title: String,
  body: String,

  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

const CommMsg = mongoose.model("CommMsg", commMsg);
module.exports = CommMsg;
