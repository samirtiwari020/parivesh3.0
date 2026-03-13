// src/controllers/reportController.js

const Application = require("../models/Application");
const Meeting = require("../models/Meeting");
const Payment = require("../models/Payment");

// Generate Application Report
exports.generateApplicationReport = async (req, res) => {
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
      message: "Failed to generate application report",
      error: error.message
    });
  }
};

// Generate Meeting Report
exports.generateMeetingReport = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate("applications")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate meeting report",
      error: error.message
    });
  }
};

// Generate Payment Report
exports.generatePaymentReport = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("application")
      .populate("applicant", "name email");

    const totalRevenue = payments
      .filter(p => p.status === "SUCCESS")
      .reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      success: true,
      count: payments.length,
      totalRevenue,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate payment report",
      error: error.message
    });
  }
};