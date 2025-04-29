const express = require("express");
const router = express.Router();
const isAdmin = require("../../middleware/isAdmin");
const redirect = require("../../middleware/redirect");

router.get("/", isAdmin, redirect, (req, res) => {
  // res.render("admin/dashboard");
  res.send("Welcome admin");
});

module.exports = router;
