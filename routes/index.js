const express = require("express");
const router = express.Router();

// Import routes
const profileRoutes = require("./users/profileRoutes");
const authRoutes = require("./users/authRoutes");
const exploreRoutes = require("./exploreRoutes");
const homeRoutes = require("./homeRoutes");

// Use routes
router.use("/", homeRoutes);
router.use("/user", profileRoutes);
router.use("/auth", authRoutes);
router.use('/explore', exploreRoutes);

module.exports = router;
