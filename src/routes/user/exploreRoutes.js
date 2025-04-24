const express = require("express");
const router = express.Router();

const { getExplore, getImg } = require("../../controllers/exploreController");
const wrapAsync = require("../../utils/wrapAssync");

router.get("/", wrapAsync(getExplore));

router.get("/image/:id", wrapAsync(getImg));

module.exports = router;
