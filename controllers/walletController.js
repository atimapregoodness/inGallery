const multer = require("multer");
const { storage } = require("../cloudinary");
const UploadImg = require("../models/upload");
const PublishImg = require("../models/publish");
const upload = multer({ storage });
const path = require("path");
const cloudinary = require("cloudinary").v2;
const Wallet = require("../models/wallet");

const iconMap = {
  "view-reward": "fa-arrow-down",
  "download-reward": "fa-arrow-down",
  withdraw: "fa-hand-holding-dollar",
  transfer: "fa-right-left",
  "conversion-credit": "fa-arrows-rotate", // Circular arrows for conversion (credit)
  "conversion-deduction": "fa-arrows-rotate", // Circular arrows for conversion (deduction)
  reward: "fa-gift",
  deposit: "fa-piggy-bank",
};

exports.getWallet = async (req, res) => {
  const user = req.user;

  const wallet = await Wallet.findOne({ user: user._id }).populate(
    "transactions"
  );
  const transactions = wallet.transactions;
  console.log(user);
  console.log(transactions);

  res.render("user/acct/wallet", { wallet, transactions, iconMap });
};

// Conversion rate (1 point = 1 USDT) - Change this if needed
const { addConvert, addTransaction } = require("../services/txsService");

exports.postConvert = async (req, res) => {
  const { userId, amount } = req.body;
  const CONVERSION_RATE = 0.002; // 1 point = 1 USDT (adjust as needed)
  const currency = "points";

  const result = await addConvert(userId, amount, CONVERSION_RATE);

  req.flash(result.success ? "success" : "error", result.message);
  return res.redirect("back");
};
