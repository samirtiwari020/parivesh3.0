// src/models/EDS.js

const mongoose = require("mongoose");

const edsSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    query: {
      type: String,
      required: true,
      trim: true,
    },

    response: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "RESPONDED", "CLOSED"],
      default: "OPEN",
    },

    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    respondedAt: {
      type: Date,
    },

    closedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EDS", edsSchema);