const mongoose = require("mongoose");

const personalMsg = new mongoose.Schema({
  title: String,
  body: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  seen: {
    type: Boolean,
    default: false,
  },

  createdAt: { type: Date, default: Date.now },
});

const PersonalMsg = mongoose.model("PersonalMsg", personalMsg);
module.exports = PersonalMsg;
