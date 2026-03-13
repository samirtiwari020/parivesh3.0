// src/services/gistServices.js

const Gist = require("../models/Gist");
const Meeting = require("../models/Meeting");

// Generate Gist
const generateGistService = async (meetingId, userId) => {
  const meeting = await Meeting.findById(meetingId).populate("applications");

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  const gist = await Gist.create({
    meeting: meetingId,
    preparedBy: userId,
    applications: meeting.applications.map(app => ({
      application: app._id,
      summary: `Discussion held for ${app.projectName}`,
      recommendation: "DEFERRED"
    })),
    status: "DRAFT"
  });

  return gist;
};

// Get Gist by meeting
const getGistByMeetingService = async (meetingId) => {
  const gist = await Gist.findOne({ meeting: meetingId })
    .populate("meeting")
    .populate("applications.application");

  return gist;
};

// Get Gist by ID
const getGistByIdService = async (gistId) => {
  const gist = await Gist.findById(gistId)
    .populate("meeting")
    .populate("applications.application");

  if (!gist) {
    throw new Error("Gist not found");
  }

  return gist;
};

// Update Gist
const updateGistService = async (gistId, data) => {
  const gist = await Gist.findByIdAndUpdate(
    gistId,
    data,
    { new: true, runValidators: true }
  );

  if (!gist) {
    throw new Error("Gist not found");
  }

  return gist;
};

// Finalize Gist
const finalizeGistService = async (gistId) => {
  const gist = await Gist.findById(gistId);

  if (!gist) {
    throw new Error("Gist not found");
  }

  gist.status = "FINALIZED";
  gist.finalizedAt = new Date();

  await gist.save();

  return gist;
};

module.exports = {
  generateGistService,
  getGistByMeetingService,
  getGistByIdService,
  updateGistService,
  finalizeGistService
};