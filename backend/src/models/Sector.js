// src/models/Sector.js

const mongoose = require("mongoose");

const sectorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    categoryTypes: [
      {
        type: String,
        enum: ["A", "B1", "B2"],
      },
    ],

    clearanceTypes: [
      {
        type: String,
        enum: ["EC", "FC", "WL", "CRZ"],
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sector", sectorSchema);