const express = require("express");
const router = express.Router();

// Import routes
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const exploreRoutes = require("./exploreRoutes");
const homeRoutes = require("./homeRoutes");

// Use routes
router.use("/", homeRoutes);
router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use('/explore', exploreRoutes);

module.exports = router;
