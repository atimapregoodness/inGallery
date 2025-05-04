const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  getLogin,
  getSignup,
  postSignup,
  postLogin,
  getLogout,
} = require("../../../controllers/user/authController");
const wrapAsync = require("../../../utils/wrapAssync");

router.get("/login", wrapAsync(getLogin));

router.post("/login", wrapAsync(postLogin));

router.get("/signup", wrapAsync(getSignup));

router.post("/signup", wrapAsync(postSignup));

router.get("/logout", wrapAsync(getLogout));

module.exports = router;
