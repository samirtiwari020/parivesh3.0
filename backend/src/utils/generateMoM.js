// src/utils/generateMom.js

const MoM = require("../models/MoM");
const Meeting = require("../models/Meeting");

const generateMom = async (meetingId, userId) => {
  const meeting = await Meeting.findById(meetingId).populate("applications");

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  const applicationsData = meeting.applications.map((app) => ({
    application: app._id,
    decision: "DEFERRED",
    remarks: `Discussion held for project: ${app.projectName}`,
  }));

  const mom = await MoM.create({
    meeting: meeting._id,
    preparedBy: userId,
    applications: applicationsData,
    status: "DRAFT",
  });

  return mom;
};

module.exports = generateMom;