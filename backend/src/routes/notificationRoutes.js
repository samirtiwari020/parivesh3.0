// src/routes/notificationRoutes.js

const express = require("express");
const router = express.Router();

const {
  getNotifications,
  getAllAdminNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

// Get user notifications
router.get(
  "/",
  authMiddleware,
  getNotifications
);

// Get ALL notifications for admin
router.get(
  "/admin/all",
  authMiddleware,
  getAllAdminNotifications
);

// Mark one notification as read
router.put(
  "/read/:id",
  authMiddleware,
  markAsRead
);

// Mark all notifications as read
router.put(
  "/read-all",
  authMiddleware,
  markAllAsRead
);

// Delete notification
router.delete(
  "/:id",
  authMiddleware,
  deleteNotification
);

module.exports = router;