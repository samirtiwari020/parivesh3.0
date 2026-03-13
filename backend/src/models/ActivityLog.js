// src/models/ActivityLog.js

const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    module: {
      type: String,
      enum: [
        "APPLICATION",
        "DOCUMENT",
        "PAYMENT",
        "EDS",
        "MEETING",
        "USER",
        "SYSTEM"
      ],
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    referenceModel: {
      type: String,
      enum: [
        "Application",
        "Document",
        "Payment",
        "EDS",
        "Meeting",
        "User"
      ],
    },

    description: {
      type: String,
      trim: true,
    },

    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);