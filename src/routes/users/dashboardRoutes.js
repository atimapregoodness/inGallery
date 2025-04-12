const express = require("express");
const router = express.Router();
const {
  getDashboardImages,
  getUpload,
  uploadImg,
  publishImg,
  getDashboard,
  deleteImg,
} = require("../../controllers/dashboardController");

const {
  getWallet,
  postConvert,
  editWalletAddress,
  postWithdraw,
} = require("../../controllers/walletController");

const {
  getProfile,
  getEditProfile,
  postEditProfile,
} = require("../../controllers/profileController");

const multer = require("multer");

const { storage } = require("../../cloudinary");
const upload = multer({ storage });
const wrapAsync = require("../../utils/wrapAssync");

router.get("/dashboard", wrapAsync(getDashboard));

router.get("/dashboard/:id", wrapAsync(getDashboardImages));

router.get("/upload", wrapAsync(getUpload));

router.post("/upload", upload.single("img"), wrapAsync(uploadImg));

router.get("/dashboard/:id/publish", wrapAsync(publishImg));

router.get("/dashboard/:id/delete", wrapAsync(deleteImg));

router.get("/wallet", wrapAsync(getWallet));

router.post("/wallet/convert-usdt", wrapAsync(postConvert));

router.post("/wallet/edit-wallet-address", wrapAsync(editWalletAddress));

router.post("/wallet/withdraw", wrapAsync(postWithdraw));

router.get("/profile", wrapAsync(getProfile));

router.get("/profile/edit-profile", wrapAsync(getEditProfile));

router.post(
  "/profile/edit-profile",
  upload.single("profileImg"),
  wrapAsync(postEditProfile)
);

module.exports = router;
