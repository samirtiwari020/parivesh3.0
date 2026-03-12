// src/routes/notificationRoutes.js

const express = require("express");
const router = express.Router();

const {
  getNotifications,
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