const express = require("express");
const router = express.Router();
const {
  getDashboardImages,
  getUpload,
  uploadImg,
  publishImg,
  getDashboard,
  deleteImg,
} = require("../../../controllers/user/dashboardController");

const {
  getWallet,
  postConvert,
  editWalletAddress,
  postWithdraw,
} = require("../../../controllers/user/walletController");

const {
  getProfile,
  getEditProfile,
  postEditProfile,
} = require("../../../controllers/user/profileController");

const multer = require("multer");

const { storage } = require("../../../cloudinary");
const upload = multer({ storage });
const wrapAsync = require("../../../utils/wrapAssync");

const redirectDashboard = require("../../../middleware/redirect");

router.get("/dashboard", redirectDashboard, wrapAsync(getDashboard));

router.get("/dashboard/:id", redirectDashboard, wrapAsync(getDashboardImages));

router.get("/upload", redirectDashboard, wrapAsync(getUpload));

router.post(
  "/upload",
  redirectDashboard,
  upload.single("img"),
  wrapAsync(uploadImg)
);

router.get("/dashboard/:id/publish", redirectDashboard, wrapAsync(publishImg));

router.get("/dashboard/:id/delete", redirectDashboard, wrapAsync(deleteImg));

router.get("/wallet", redirectDashboard, wrapAsync(getWallet));

router.post("/wallet/convert-usdt", redirectDashboard, wrapAsync(postConvert));

router.post(
  "/wallet/edit-wallet-address",
  redirectDashboard,
  wrapAsync(editWalletAddress)
);

router.post("/wallet/withdraw", redirectDashboard, wrapAsync(postWithdraw));

router.get("/profile", redirectDashboard, wrapAsync(getProfile));

router.get(
  "/profile/edit-profile",
  redirectDashboard,
  wrapAsync(getEditProfile)
);

router.post(
  "/profile/edit-profile",
  upload.single("profileImg"),
  redirectDashboard,
  wrapAsync(postEditProfile)
);

module.exports = router;
