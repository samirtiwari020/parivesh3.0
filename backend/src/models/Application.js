const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // Applicant who created the application
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic Project Details
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    projectDescription: {
      type: String,
      trim: true,
    },

    sector: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["A", "B1", "B2"],
      required: true,
    },

    clearanceType: {
      type: String,
      enum: ["EC", "FC", "WL", "CRZ"],
      required: true,
    },

    // Location Details
    state: {
      type: String,
      required: true,
    },

    district: {
      type: String,
    },

    village: {
      type: String,
    },

    coordinates: {
      latitude: Number,
      longitude: Number,
    },

    // Financial Information
    projectCost: {
      type: Number,
    },

    applicationFee: {
      type: Number,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },

    paymentId: {
      type: String,
    },

    // Workflow Status
    status: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED",
        "UNDER_SCRUTINY",
        "EDS_RAISED",
        "RESUBMITTED",
        "REFERRED_TO_MEETING",
        "IN_MEETING",
        "APPROVED",
        "REJECTED",
      ],
      default: "DRAFT",
    },

    // Scrutiny Officer
    scrutinyOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    scrutinyRemarks: {
      type: String,
    },

    // EDS reference
    edsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EDS",
    },
    
    // EDS Workflow Internal Tracking
    edsDetails: {
      isRaised: { type: Boolean, default: false },
      queries: [{ type: String }],
      raisedAt: { type: Date },
      resolvedAt: { type: Date }
    },

    // Meeting reference
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
    },

    // Generated documents
    gistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gist",
    },

    momId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MoM",
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    lockedAt: {
      type: Date,
    },
    
    // Legal Compliance
    affidavitAccepted: {
      type: Boolean,
      default: false,
    },

    // Documents uploaded
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    // Timeline history
    history: [
      {
        status: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        remarks: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);