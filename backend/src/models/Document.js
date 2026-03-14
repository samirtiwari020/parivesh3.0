const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    // Linked application
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    // User who uploaded the document
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Document information
    documentName: {
      type: String,
      required: true,
      trim: true,
    },

    documentType: {
      type: String,
      required: true,
    },

    // File details
    filePath: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
    },

    fileType: {
      type: String,
    },

    // Version control
    version: {
      type: Number,
      default: 1,
    },

    isLatest: {
      type: Boolean,
      default: true,
    },

    // Verification by officer
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },

    remarks: {
      type: String,
    },

    // Soft delete
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Document", documentSchema);