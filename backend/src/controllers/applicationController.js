// src/controllers/applicationController.js

const Application = require("../models/Application");

// Create new application
exports.createApplication = async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      applicant: req.user._id,
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
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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