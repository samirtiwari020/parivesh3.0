// src/services/notificationServices.js

const Notification = require("../models/Notification");

// Create notification
const createNotificationService = async (data) => {
  const notification = await Notification.create({
    ...data
  });

  return notification;
};

// Get notifications for a user
const getUserNotificationsService = async (userId) => {
  const notifications = await Notification.find({
    recipient: userId
  }).sort({ createdAt: -1 });

  return notifications;
};

// Mark notification as read
const markNotificationAsReadService = async (notificationId) => {
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    {
      isRead: true,
      readAt: new Date()
    },
    { new: true }
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

// Mark all notifications as read
const markAllNotificationsAsReadService = async (userId) => {
  await Notification.updateMany(
    { recipient: userId, isRead: false },
    {
      isRead: true,
      readAt: new Date()
    }
  );

  return true;
};

// Delete notification
const deleteNotificationService = async (notificationId) => {
  const notification = await Notification.findByIdAndDelete(notificationId);

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

module.exports = {
  createNotificationService,
  getUserNotificationsService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  deleteNotificationService
};