// src/controllers/applicationController.js

const Application = require("../models/Application");
const ActivityLog = require("../models/ActivityLog");

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
    const applications = await Application.find()
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

    const previousStatus = application.status;
    Object.assign(application, req.body);

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

const reviewActionMap = {
  APPROVE: "APPROVED",
  REJECT: "REJECTED",
  FORWARD: "REFERRED_TO_MEETING",
  SEND_BACK: "EDS_RAISED",
};

exports.reviewApplication = async (req, res) => {
  try {
    const { action, remarks } = req.body;
    const status = reviewActionMap[action];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Invalid review action",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
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