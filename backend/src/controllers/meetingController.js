// src/controllers/meetingController.js

const Meeting = require("../models/Meeting");
const Application = require("../models/Application");

// Create meeting
exports.createMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Meeting creation failed",
      error: error.message
    });
  }
};

// Get all meetings
exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate("createdBy", "name email")
      .populate("applications");

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
      error: error.message
    });
  }
};

// Get meeting by ID
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("applications");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    res.status(200).json({
      success: true,
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching meeting",
      error: error.message
    });
  }
};

// Update meeting
exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    res.status(200).json({
      success: true,
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Meeting update failed",
      error: error.message
    });
  }
};

// Delete meeting
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Meeting deletion failed",
      error: error.message
    });
  }
};

// Add application to meeting agenda
exports.addApplicationToMeeting = async (req, res) => {
  try {
    const { applicationId } = req.body;

    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    meeting.applications.push(applicationId);
    await meeting.save();

    await Application.findByIdAndUpdate(applicationId, {
      meetingId: meeting._id,
      status: "IN_MEETING"
    });

    res.status(200).json({
      success: true,
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add application to meeting",
      error: error.message
    });
  }
};