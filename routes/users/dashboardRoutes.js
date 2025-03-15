const express = require('express');
const router = express.Router();
const { getDashboardImages, getUpload, uploadImg, publishImg, getDashboard, deleteImg } = require('../../controllers/dashboardController');
const { getWallet } = require('../../controllers/walletController');
const multer = require("multer");
const { storage } = require("../../cloudinary");
const upload = multer({ storage });
const wrapAsync = require('../../utils/wrapAssync');


router.get('/dashboard', wrapAsync(getDashboard));

router.get('/dashboard/:id', wrapAsync(getDashboardImages));

router.get('/upload', wrapAsync(getUpload));

router.post('/upload', upload.single('img'), wrapAsync(uploadImg));

router.get('/dashboard/:id/publish', wrapAsync(publishImg));

router.get('/dashboard/:id/delete', wrapAsync(deleteImg));

router.get('/wallet', wrapAsync(getWallet));

module.exports = router;