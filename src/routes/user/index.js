const express = require("express");
const router = express.Router();

// Import routes
const profileRoutes = require("../user/users/dashboardRoutes");
const authRoutes = require("../user/users/authRoutes");
const exploreRoutes = require("../user/exploreRoutes");
const homeRoutes = require("./homeRoutes");
const redirect = require("../../middleware/redirect");

// Use routes
router.use("/", homeRoutes);
router.use("/user", profileRoutes);
router.use("/auth", authRoutes);
router.use("/explore", exploreRoutes);

module.exports = router;
