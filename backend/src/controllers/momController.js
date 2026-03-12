// src/controllers/momController.js

const MoM = require("../models/MoM");
const Meeting = require("../models/Meeting");

// Generate MoM
exports.generateMoM = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId).populate("applications");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    const mom = await MoM.create({
      meeting: meeting._id,
      preparedBy: req.user._id,
      applications: meeting.applications.map(app => ({
        application: app._id,
        decision: "DEFERRED",
        remarks: `Discussion held for ${app.projectName}`
      })),
      status: "DRAFT"
    });

    res.status(201).json({
      success: true,
      mom
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "MoM generation failed",
      error: error.message
    });
  }
};

// Get MoM by meeting
exports.getMoMByMeeting = async (req, res) => {
  try {
    const mom = await MoM.findOne({ meeting: req.params.meetingId })
      .populate("meeting")
      .populate("applications.application");

    res.status(200).json({
      success: true,
      mom
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch MoM",
      error: error.message
    });
  }
};

// Get MoM by ID
exports.getMoMById = async (req, res) => {
  try {
    const mom = await MoM.findById(req.params.id)
      .populate("meeting")
      .populate("applications.application");

    if (!mom) {
      return res.status(404).json({
        success: false,
        message: "MoM not found"
      });
    }

    res.status(200).json({
      success: true,
      mom
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching MoM",
      error: error.message
    });
  }
};

// Finalize MoM
exports.finalizeMoM = async (req, res) => {
  try {
    const mom = await MoM.findById(req.params.id);

    if (!mom) {
      return res.status(404).json({
        success: false,
        message: "MoM not found"
      });
    }

    mom.status = "APPROVED";
    mom.publishedAt = new Date();

    await mom.save();

    res.status(200).json({
      success: true,
      mom
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to finalize MoM",
      error: error.message
    });
  }
};