const multer = require('multer');
const { storage } = require('../cloudinary');
const UploadImg = require('../models/upload');
const PublishImg = require('../models/publish');
const upload = multer({ storage });
const path = require('path');
const cloudinary = require('cloudinary').v2;
const Wallet = require('../models/wallet');

exports.getWallet = async (req, res) => {
  const user = req.user;

  const wallet = await Wallet.findOne({ user: user._id }).populate('transactions');
  const transactions = wallet.transactions;
  console.log(user);
  console.log(transactions);
  res.render('user/acct/wallet', { wallet, transactions });
};