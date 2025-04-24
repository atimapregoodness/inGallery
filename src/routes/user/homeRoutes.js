const express = require("express");
const router = express.Router();
const wrapAssync = require("../../utils/wrapAssync");

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/home", (req, res) => {
  res.render("index");
});

module.exports = router;
