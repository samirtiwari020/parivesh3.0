// src/jobs/notificationJob.js

const Notification = require("../models/Notification");

/*
  This job can be used for:
  - Cleaning old notifications
  - Sending scheduled system notifications
  - Auto-marking expired notifications inactive
*/

const runNotificationJob = async () => {
  try {
    console.log("Running Notification Job...");

    // Example: deactivate notifications older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Notification.updateMany(
      {
        createdAt: { $lt: thirtyDaysAgo },
        isActive: true
      },
      {
        isActive: false
      }
    );

    console.log(`Notification cleanup completed. Updated: ${result.modifiedCount}`);

  } catch (error) {
    console.error("Notification Job Failed:", error.message);
  }
};

module.exports = runNotificationJob;