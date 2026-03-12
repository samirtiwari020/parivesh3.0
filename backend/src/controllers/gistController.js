// src/controllers/gistController.js

const Gist = require("../models/Gist");
const Meeting = require("../models/Meeting");

// Generate Gist
exports.generateGist = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId).populate("applications");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    const gist = await Gist.create({
      meeting: meeting._id,
      preparedBy: req.user._id,
      applications: meeting.applications.map(app => ({
        application: app._id,
        summary: `Discussion held for ${app.projectName}`,
        recommendation: "DEFERRED"
      })),
      status: "DRAFT"
    });

    res.status(201).json({
      success: true,
      gist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gist generation failed",
      error: error.message
    });
  }
};

// Get Gist by Meeting
exports.getGistByMeeting = async (req, res) => {
  try {
    const gist = await Gist.findOne({ meeting: req.params.meetingId })
      .populate("meeting")
      .populate("applications.application");

    res.status(200).json({
      success: true,
      gist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gist",
      error: error.message
    });
  }
};

// Get Gist by ID
exports.getGistById = async (req, res) => {
  try {
    const gist = await Gist.findById(req.params.id)
      .populate("meeting")
      .populate("applications.application");

    if (!gist) {
      return res.status(404).json({
        success: false,
        message: "Gist not found"
      });
    }

    res.status(200).json({
      success: true,
      gist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching gist",
      error: error.message
    });
  }
};

// Update Gist
exports.updateGist = async (req, res) => {
  try {
    const gist = await Gist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!gist) {
      return res.status(404).json({
        success: false,
        message: "Gist not found"
      });
    }

    res.status(200).json({
      success: true,
      gist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gist update failed",
      error: error.message
    });
  }
};

// Finalize Gist
exports.finalizeGist = async (req, res) => {
  try {
    const gist = await Gist.findById(req.params.id);

    if (!gist) {
      return res.status(404).json({
        success: false,
        message: "Gist not found"
      });
    }

    gist.status = "FINALIZED";
    gist.finalizedAt = new Date();
    await gist.save();

    res.status(200).json({
      success: true,
      gist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to finalize gist",
      error: error.message
    });
  }
};