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
  withdrawal: "fa-hand-holding-dollar",
  transfer: "fa-right-left",
  "conversion-credit": "fa-arrows-rotate", // Circular arrows for conversion (credit)
  "conversion-deduction": "fa-arrows-rotate", // Circular arrows for conversion (deduction)
  reward: "fa-gift",
  deposit: "fa-piggy-bank",
};

exports.getWallet = async (req, res) => {
  try {
    const user = req.user;
    const wallet = await Wallet.findOne({ user: user._id }).populate(
      "transactions"
    );

    if (!wallet) {
      req.flash("error", "Wallet not found.");
      return res.redirect("/user/dashboard");
    }
    const transactions = wallet.transactions;

    res.locals.transactions = transactions;
    res.locals.iconMap = iconMap;
    res.locals.wallet = wallet;

    res.render("user/wallet", { wallet, transactions, iconMap });
    // res.render("user/wallet");
  } catch (error) {
    console.error(error);
    req.flash("error", "Server error. Please try again.");
    res.redirect("/user/dashboard");
  }
};

// Conversion rate (1 point = 1 USDT) - Change this if needed
const {
  addConvert,
  addTransaction,
  withdrawAddTransaction,
} = require("../services/txsService");

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
  try {
    const { walletAddress } = req.body;
    console.log(walletAddress);
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
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      req.flash("error", "Wallet not found.");
      return res.redirect("/user/wallet");
    } else {
      wallet.usdtAddress = walletAddress;
      try {
        await wallet.save();
        req.flash("success", "Wallet address updated successfully.");
        console.log(wallet);
        return res.redirect("/user/wallet");
      } catch (validationError) {
        console.error(validationError);
        req.flash(
          "error",
          "Failed to update wallet address. Please try again."
        );
        return res.redirect("/user/wallet");
      }
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Server error. Please try again.");
    res.redirect("/user/wallet");
  }
};

exports.postWithdraw = async (req, res) => {
  try {
    const { usdtAmt, userId } = req.body;

    const amount = parseFloat(usdtAmt);
    console.log(req.body, amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      req.flash("error", "Invalid withdrawal amount.");
      return res.redirect("/user/wallet");
    }

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      req.flash("error", "Wallet not found.");
      return res.redirect("/user/wallet");
    }

    if (!wallet.usdtBalance || wallet.usdtBalance < amount) {
      req.flash("error", "Insufficient balance for withdrawal.");
      return res.redirect("/user/wallet");
    }

    // Process the withdrawal with the timeout logic handled in withdrawAddTransaction
    let result;
    try {
      result = await withdrawAddTransaction(
        userId,
        amount,
        "USDT", // Ensure the currency matches the enum value in your schema
        "withdrawal"
      );
    } catch (error) {
      console.error("Error during withdrawal transaction:", error);
      req.flash("error", "Failed to process withdrawal. Please try again.");
      return res.redirect("/user/wallet");
    }

    if (!result.success) {
      req.flash("error", result.message);
      return res.redirect("/user/wallet");
    }

    req.flash(
      "info",
      "Withdrawal is being processed. Please check back later."
    );

    res.redirect("/user/wallet");
  } catch (error) {
    console.error(error);
    req.flash("error", "Server error. Please try again.");
    res.redirect("/user/wallet");
  }
};
