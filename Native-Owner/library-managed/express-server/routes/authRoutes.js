const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  registerOwner,
} = require("../controllers/authController");

// @desc    Register a new member
// @route   POST /api/auth/register
// @access  Public
router.post("/register", registerUser);

// @desc    Register a new owner (FOR DEVELOPMENT ONLY)
// @route   POST /api/auth/register-owner
// @access  Public
router.post("/register-owner", registerOwner);

// @desc    Authenticate a user and get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", loginUser);

module.exports = router;
