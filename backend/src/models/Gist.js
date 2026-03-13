// src/models/Gist.js

const mongoose = require("mongoose");

const gistSchema = new mongoose.Schema(
  {
    meeting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
    },

    preparedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applications: [
      {
        application: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Application",
        },
        summary: {
          type: String,
          trim: true,
        },
        recommendation: {
          type: String,
          enum: ["RECOMMENDED", "NOT_RECOMMENDED", "DEFERRED"],
        },
      },
    ],

    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    status: {
      type: String,
      enum: ["DRAFT", "FINALIZED"],
      default: "DRAFT",
    },

    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gist", gistSchema);