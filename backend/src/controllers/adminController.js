// src/controllers/adminController.js

const User = require("../models/User");
const Application = require("../models/Application");
const Meeting = require("../models/Meeting");
const ActivityLog = require("../models/ActivityLog");

// Admin dashboard summary
exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalMeetings = await Meeting.countDocuments();

    const pendingApplications = await Application.countDocuments({
      status: "SUBMITTED"
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalApplications,
        totalMeetings,
        pendingApplications
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
      error: error.message
    });
  }
};

// Get all applications (admin view)
exports.getAllApplicationsAdmin = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("applicant", "name email")
      .populate("sector");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message
    });
  }
};

// Activate / deactivate user
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message
    });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("user", "name email role");

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
      error: error.message,
    });
  }
};