// src/models/Template.js

const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "APPLICATION_TEMPLATE",
        "EMAIL_TEMPLATE",
        "NOTIFICATION_TEMPLATE",
        "GIST_TEMPLATE",
        "MOM_TEMPLATE",
        "REPORT_TEMPLATE"
      ],
      required: true,
    },

    title: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    variables: [
      {
        type: String,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Template", templateSchema);