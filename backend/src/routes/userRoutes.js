// src/routes/userRoutes.js

const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserDashboard
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get logged-in user's dashboard
router.get(
  "/dashboard",
  authMiddleware,
  getUserDashboard
);

// Admin: Get all users
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllUsers
);

// Get single user
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getUserById
);

// Update user
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateUser
);

// Delete user
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteUser
);

module.exports = router;