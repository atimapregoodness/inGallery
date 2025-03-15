const multer = require('multer');
const { storage } = require('../cloudinary');
const UploadImg = require('../models/upload');
const PublishImg = require('../models/publish');
const upload = multer({ storage });
const path = require('path');
const cloudinary = require('cloudinary').v2;

exports.getWallet = async (req, res) => {
  res.render('acct/wallet');
};