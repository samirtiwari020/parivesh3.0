// src/controllers/edsController.js

const EDS = require("../models/EDS");
const Application = require("../models/Application");

// Raise EDS
exports.raiseEDS = async (req, res) => {
  try {
    const { applicationId, query } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const eds = await EDS.create({
      application: applicationId,
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

// Respond to EDS
exports.respondEDS = async (req, res) => {
  try {
    const { response } = req.body;

    const eds = await EDS.findById(req.params.id);

    if (!eds) {
      return res.status(404).json({
        success: false,
        message: "EDS not found",
      });
    }

    eds.response = response;
    eds.respondedBy = req.user._id;
    eds.status = "RESPONDED";
    eds.respondedAt = new Date();

    await eds.save();

    const application = await Application.findById(eds.application);
    application.status = "RESUBMITTED";

    application.history.push({
      status: "RESUBMITTED",
      updatedBy: req.user._id,
      remarks: "EDS response submitted",
    });

    await application.save();

    res.status(200).json({
      success: true,
      eds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to respond to EDS",
      error: error.message,
    });
  }
};

// Get EDS by Application
exports.getEDSByApplication = async (req, res) => {
  try {
    const eds = await EDS.find({
      application: req.params.applicationId,
    })
      .populate("raisedBy", "name email")
      .populate("respondedBy", "name email");

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

// Close EDS
exports.closeEDS = async (req, res) => {
  try {
    const eds = await EDS.findById(req.params.id);

    if (!eds) {
      return res.status(404).json({
        success: false,
        message: "EDS not found",
      });
    }

    eds.status = "CLOSED";
    eds.closedAt = new Date();

    await eds.save();

    res.status(200).json({
      success: true,
      eds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to close EDS",
      error: error.message,
    });
  }
};