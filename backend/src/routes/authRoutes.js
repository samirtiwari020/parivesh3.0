// src/routes/authRoutes.js

const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", authMiddleware, logoutUser);
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;