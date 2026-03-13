// src/services/meetingServices.js

const Meeting = require("../models/Meeting");
const Application = require("../models/Application");

// Create Meeting
const createMeetingService = async (data, userId) => {
  const meeting = await Meeting.create({
    ...data,
    createdBy: userId
  });

  return meeting;
};

// Get all meetings
const getAllMeetingsService = async () => {
  const meetings = await Meeting.find()
    .populate("applications")
    .populate("createdBy", "name email")
    .sort({ meetingDate: -1 });

  return meetings;
};

// Get meeting by ID
const getMeetingByIdService = async (meetingId) => {
  const meeting = await Meeting.findById(meetingId)
    .populate("applications")
    .populate("createdBy", "name email");

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  return meeting;
};

// Add applications to meeting
const addApplicationsToMeetingService = async (meetingId, applicationIds) => {
  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  meeting.applications.push(...applicationIds);

  await meeting.save();

  await Application.updateMany(
    { _id: { $in: applicationIds } },
    { status: "REFERRED_TO_MEETING" }
  );

  return meeting;
};

// Update meeting
const updateMeetingService = async (meetingId, data) => {
  const meeting = await Meeting.findByIdAndUpdate(
    meetingId,
    data,
    { new: true, runValidators: true }
  );

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  return meeting;
};

// Delete meeting
const deleteMeetingService = async (meetingId) => {
  const meeting = await Meeting.findByIdAndDelete(meetingId);

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  return meeting;
};

module.exports = {
  createMeetingService,
  getAllMeetingsService,
  getMeetingByIdService,
  addApplicationsToMeetingService,
  updateMeetingService,
  deleteMeetingService
};
