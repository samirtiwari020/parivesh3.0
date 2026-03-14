// src/controllers/applicationController.js

const Application = require("../models/Application");
const ActivityLog = require("../models/ActivityLog");

const isApplicant = (user) => user?.role === "APPLICANT";

const createActivityLog = async ({ userId, action, description, referenceId }) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      module: "APPLICATION",
      referenceId,
      referenceModel: "Application",
      description,
    });
  } catch {
  }
};

// Create new application
exports.createApplication = async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      applicant: req.user._id,
    });

    await createActivityLog({
      userId: req.user._id,
      action: "APPLICATION_CREATED",
      description: `Application created: ${application.projectName}`,
      referenceId: application._id,
    });

    res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Application creation failed",
      error: error.message,
    });
  }
};

// Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const query = isApplicant(req.user) ? { applicant: req.user._id } : {};

    const applications = await Application.find(query)
      .populate("applicant", "name email role")
      .populate("documents")
      .populate("meetingId");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("applicant", "name email role")
      .populate("documents")
      .populate("meetingId")
      .populate("gistId")
      .populate("momId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      isApplicant(req.user) &&
      application.applicant &&
      application.applicant._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching application",
      error: error.message,
    });
  }
};

// Update application
exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      isApplicant(req.user) &&
      application.applicant.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const previousStatus = application.status;

    if (isApplicant(req.user)) {
      const allowedApplicantFields = [
        "projectName",
        "projectDescription",
        "sector",
        "category",
        "clearanceType",
        "state",
        "district",
        "projectCost",
        "coordinates",
      ];

      for (const field of allowedApplicantFields) {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
          application[field] = req.body[field];
        }
      }

      if (application.status === "EDS_RAISED") {
        application.status = "RESUBMITTED";
        application.history.push({
          status: "RESUBMITTED",
          updatedBy: req.user._id,
          remarks: req.body.applicantResponseRemark || "Application resubmitted after clarification",
        });
      }
    } else {
      Object.assign(application, req.body);
    }

    if (req.body.status && req.body.status !== previousStatus) {
      application.history.push({
        status: req.body.status,
        updatedBy: req.user._id,
        remarks: req.body.remarks || `Status updated by ${req.user.role}`,
      });
    }

    await application.save();

    await createActivityLog({
      userId: req.user._id,
      action: "APPLICATION_UPDATED",
      description: `Application updated: ${application.projectName}`,
      referenceId: application._id,
    });

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Application update failed",
      error: error.message,
    });
  }
};

// Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await createActivityLog({
      userId: req.user._id,
      action: "APPLICATION_DELETED",
      description: `Application deleted: ${application.projectName}`,
      referenceId: application._id,
    });

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Application deletion failed",
      error: error.message,
    });
  }
};

// Submit application
exports.submitApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.paymentStatus !== "PAID") {
      return res.status(400).json({
        success: false,
        message: "Payment required before submission",
      });
    }

    if (
      isApplicant(req.user) &&
      application.applicant.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    application.status = "SUBMITTED";

    application.history.push({
      status: "SUBMITTED",
      updatedBy: req.user._id,
      remarks: "Application submitted",
    });

    await application.save();

    await createActivityLog({
      userId: req.user._id,
      action: "APPLICATION_SUBMITTED",
      description: `Application submitted: ${application.projectName}`,
      referenceId: application._id,
    });

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Submission failed",
      error: error.message,
    });
  }
};

const roleActionStatusMap = {
  ADMIN: {
    APPROVE: "APPROVED",
    REJECT: "REJECTED",
    FORWARD: "REFERRED_TO_MEETING",
    SEND_BACK: "EDS_RAISED",
  },
  STATE_REVIEWER: {
    APPROVE: "APPROVED",
    REJECT: "REJECTED",
    FORWARD: "REFERRED_TO_MEETING",
    SEND_BACK: "EDS_RAISED",
  },
  CENTRAL_REVIEWER: {
    APPROVE: "REFERRED_TO_MEETING",
    REJECT: "REJECTED",
    SEND_BACK: "EDS_RAISED",
  },
  COMMITTEE_REVIEWER: {
    APPROVE: "APPROVED",
    REJECT: "REJECTED",
    SEND_BACK: "EDS_RAISED",
  },
};

exports.reviewApplication = async (req, res) => {
  try {
    const { action, remarks } = req.body;
    const status = roleActionStatusMap[req.user.role]?.[action];

    if (action === "SEND_BACK" && (!remarks || !String(remarks).trim())) {
      return res.status(400).json({
        success: false,
        message: "Clarification comment is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Invalid review action for current role",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (req.user.role === "COMMITTEE_REVIEWER" && application.status !== "REFERRED_TO_MEETING") {
      return res.status(400).json({
        success: false,
        message: "Only applications approved by central reviewer can be reviewed by committee",
      });
    }

    application.status = status;
    application.history.push({
      status,
      updatedBy: req.user._id,
      remarks: remarks || `${action} by ${req.user.role}`,
    });

    await application.save();

    await createActivityLog({
      userId: req.user._id,
      action: `APPLICATION_${action}`,
      description: `Application ${action.toLowerCase()}: ${application.projectName}`,
      referenceId: application._id,
    });

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Review action failed",
      error: error.message,
    });
  }
};

// Raise EDS (Essential Document Shortcomings)
exports.raiseEDS = async (req, res) => {
  try {
    const { queries } = req.body; // Array of missing document strings
    
    if (!queries || !Array.isArray(queries) || queries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "EDS queries must be provided as a non-empty array of strings",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = "EDS_RAISED";
    application.edsDetails = {
      isRaised: true,
      queries: queries,
      raisedAt: new Date(),
    };

    application.history.push({
      status: "EDS_RAISED",
      updatedBy: req.user._id,
      remarks: `EDS Raised for ${queries.length} missing items.`,
    });

    await application.save();

    await createActivityLog({
      userId: req.user._id,
      action: "EDS_RAISED",
      description: `EDS Raised on application: ${application.projectName}`,
      referenceId: application._id,
    });

    res.status(200).json({
      success: true,
      message: "EDS raised successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to raise EDS",
      error: error.message,
    });
  }
};

// Resolve EDS (Essential Document Shortcomings)
exports.resolveEDS = async (req, res) => {
  try {
    const { remarks } = req.body;
    
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      isApplicant(req.user) &&
      application.applicant.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (application.status !== "EDS_RAISED") {
      return res.status(400).json({
        success: false,
        message: "Application is not in EDS_RAISED status",
      });
    }

    application.status = "RESUBMITTED";
    
    // Mark EDS as resolved
    if (application.edsDetails) {
      application.edsDetails.isRaised = false;
      application.edsDetails.resolvedAt = new Date();
    }

    application.history.push({
      status: "RESUBMITTED",
      updatedBy: req.user._id,
      remarks: remarks || "Applicant has uploaded missing documents to resolve EDS.",
    });

    await application.save();

    await createActivityLog({
      userId: req.user._id,
      action: "EDS_RESOLVED",
      description: `EDS resolved and application resubmitted: ${application.projectName}`,
      referenceId: application._id,
    });

    res.status(200).json({
      success: true,
      message: "EDS resolved successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to resolve EDS",
      error: error.message,
    });
  }
};