// src/models/MoM.js

const mongoose = require("mongoose");

const momSchema = new mongoose.Schema(
  {
    meeting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
      required: false,
    },

    preparedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    applications: [
      {
        application: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Application",
        },
        decision: {
          type: String,
          enum: ["APPROVED", "REJECTED", "DEFERRED"],
        },
        remarks: {
          type: String,
          trim: true,
        },
      },
    ],

    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    status: {
      type: String,
      enum: ["DRAFT", "APPROVED", "PUBLISHED"],
      default: "DRAFT",
    },

    publishedAt: {
      type: Date,
    },

    remarks: {
      type: String,
    },

    content: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MoM", momSchema);