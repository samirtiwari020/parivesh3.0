// src/models/Meeting.js

const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    meetingTitle: {
      type: String,
      required: true,
      trim: true,
    },

    meetingType: {
      type: String,
      enum: ["EAC", "SEAC", "FAC", "WLAC", "OTHER"],
      required: true,
    },

    meetingDate: {
      type: Date,
      required: true,
    },

    meetingTime: {
      type: String,
    },

    venue: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],

    status: {
      type: String,
      enum: ["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
    },

    agendaDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    gistDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    momDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", meetingSchema);