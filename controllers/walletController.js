const multer = require("multer");
const { storage } = require("../cloudinary");
const UploadImg = require("../models/upload");
const PublishImg = require("../models/publish");
const upload = multer({ storage });
const path = require("path");
const cloudinary = require("cloudinary").v2;
const Wallet = require("../models/wallet");
const isValidBSCAddress = require("../validations/usdtWalletValidation");

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

exports.editWalletAddress = async (req, res) => {
  // res.send(req.body);
  console.log(req.body);
  try {
    const { walletAddress } = req.body;
    const userId = req.user._id;
    if (!walletAddress) {
      req.flash("error", "Wallet address is required.");
      return res.redirect("/user/wallet");
    }
    if (!isValidBSCAddress(walletAddress)) {
      req.flash(
        "error",
        'Invalid USDT (BSC) address. It must start with "0x" and be 42 characters long.'
      );
      return res.redirect("/user/wallet");
    }
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      req.flash("error", "something went wrong");
      res.redirect("/user/wallet");
    } else {
      wallet.usdtAddress = walletAddress;
      req.flash("success", "Wallet address updated successfully.");
      await wallet.save();
      console.log(wallet);
      return res.redirect("/user/wallet");
    }
    res.redirect("/user/wallet");
  } catch (error) {
    console.error(error);
    req.flash("error", "Server error. Please try again.");
    res.redirect("/user/wallet");
  }
};
