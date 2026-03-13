// src/models/Notification.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "APPLICATION_UPDATE",
        "PAYMENT_UPDATE",
        "DOCUMENT_VERIFICATION",
        "EDS_RAISED",
        "MEETING_SCHEDULED",
        "SYSTEM_NOTIFICATION"
      ],
      default: "SYSTEM_NOTIFICATION",
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    referenceModel: {
      type: String,
      enum: ["Application", "Document", "Payment", "Meeting", "EDS"],
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);