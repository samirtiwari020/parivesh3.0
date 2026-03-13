// src/services/momServices.js

const MoM = require("../models/MoM");
const Meeting = require("../models/Meeting");

// Generate MoM
const generateMoMService = async (meetingId, userId) => {
  const meeting = await Meeting.findById(meetingId).populate("applications");

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  const mom = await MoM.create({
    meeting: meetingId,
    preparedBy: userId,
    applications: meeting.applications.map(app => ({
      application: app._id,
      decision: "DEFERRED",
      remarks: `Discussion held for ${app.projectName}`
    })),
    status: "DRAFT"
  });

  return mom;
};

// Get MoM by meeting
const getMoMByMeetingService = async (meetingId) => {
  const mom = await MoM.findOne({ meeting: meetingId })
    .populate("meeting")
    .populate("applications.application");

  return mom;
};

// Get MoM by ID
const getMoMByIdService = async (momId) => {
  const mom = await MoM.findById(momId)
    .populate("meeting")
    .populate("applications.application");

  if (!mom) {
    throw new Error("MoM not found");
  }

  return mom;
};

// Update MoM
const updateMoMService = async (momId, data) => {
  const mom = await MoM.findByIdAndUpdate(
    momId,
    data,
    { new: true, runValidators: true }
  );

  if (!mom) {
    throw new Error("MoM not found");
  }

  return mom;
};

// Finalize MoM
const finalizeMoMService = async (momId) => {
  const mom = await MoM.findById(momId);

  if (!mom) {
    throw new Error("MoM not found");
  }

  mom.status = "FINALIZED";
  mom.finalizedAt = new Date();

  await mom.save();

  return mom;
};

module.exports = {
  generateMoMService,
  getMoMByMeetingService,
  getMoMByIdService,
  updateMoMService,
  finalizeMoMService
};