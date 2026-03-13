// src/controllers/scrutinyController.js

const Application = require("../models/Application");
const EDS = require("../models/EDS");

exports.assignApplicationForScrutiny = async (req, res) => {
  try {
    const { applicationId, scrutinyOfficer, remarks } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.scrutinyOfficer = scrutinyOfficer;
    application.status = "UNDER_SCRUTINY";

    application.history.push({
      status: "UNDER_SCRUTINY",
      updatedBy: req.user._id,
      remarks: remarks || "Application assigned for scrutiny",
    });

    await application.save();

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to assign application for scrutiny",
      error: error.message,
    });
  }
};

exports.getApplicationsForScrutiny = async (req, res) => {
  try {
    const filter = req.user.role === "SCRUTINY_OFFICER"
      ? { scrutinyOfficer: req.user._id }
      : { status: { $in: ["SUBMITTED", "RESUBMITTED", "UNDER_SCRUTINY"] } };

    const applications = await Application.find(filter)
      .populate("applicant", "name email")
      .populate("scrutinyOfficer", "name email")
      .populate("documents");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications for scrutiny",
      error: error.message,
    });
  }
};

exports.updateScrutinyStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;
    application.scrutinyOfficer = req.user._id;
    application.scrutinyRemarks = remarks;

    application.history.push({
      status,
      updatedBy: req.user._id,
      remarks: remarks || "Scrutiny status updated",
    });

    await application.save();

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update scrutiny status",
      error: error.message,
    });
  }
};

exports.getScrutinyDetails = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate("applicant", "name email")
      .populate("scrutinyOfficer", "name email")
      .populate("documents")
      .populate("edsId");

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
      message: "Failed to fetch scrutiny details",
      error: error.message,
    });
  }
};

// Get applications assigned for scrutiny
exports.getScrutinyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      status: { $in: ["SUBMITTED", "RESUBMITTED"] },
    })
      .populate("applicant", "name email")
      .populate("documents");

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

// Verify application and move to next stage
exports.verifyApplication = async (req, res) => {
  try {
    const { remarks } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = "REFERRED_TO_MEETING";
    application.scrutinyOfficer = req.user._id;
    application.scrutinyRemarks = remarks;

    application.history.push({
      status: "REFERRED_TO_MEETING",
      updatedBy: req.user._id,
      remarks: remarks || "Application verified and referred to meeting",
    });

    await application.save();

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};

// Raise EDS (Essential Document Sought)
exports.raiseEDS = async (req, res) => {
  try {
    const { query } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const eds = await EDS.create({
      application: application._id,
      raisedBy: req.user._id,
      query,
      status: "OPEN",
    });

    application.status = "EDS_RAISED";
    application.edsId = eds._id;

    application.history.push({
      status: "EDS_RAISED",
      updatedBy: req.user._id,
      remarks: query,
    });

    await application.save();

    res.status(201).json({
      success: true,
      eds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to raise EDS",
      error: error.message,
    });
  }
};

// Get EDS for an application
exports.getEDSByApplication = async (req, res) => {
  try {
    const eds = await EDS.find({
      application: req.params.applicationId,
    }).populate("raisedBy", "name email");

    res.status(200).json({
      success: true,
      eds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch EDS",
      error: error.message,
    });
  }
};