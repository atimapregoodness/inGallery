const express = require("express");
const router = express.Router();
const isAdmin = require("../../middleware/isAdmin");

router.get("/", isAdmin, (req, res) => {
  // res.render("admin/dashboard");
  res.send("Welcome admin");
});

module.exports = router;
