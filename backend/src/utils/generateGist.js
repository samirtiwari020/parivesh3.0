// src/utils/generateGist.js

const Gist = require("../models/Gist");
const Meeting = require("../models/Meeting");
const Application = require("../models/Application");

const generateGist = async (meetingId, userId) => {
  const meeting = await Meeting.findById(meetingId).populate("applications");

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  const applicationsData = meeting.applications.map((app) => ({
    application: app._id,
    summary: `Discussion held for project: ${app.projectName}`,
    recommendation: "DEFERRED",
  }));

  const gist = await Gist.create({
    meeting: meeting._id,
    preparedBy: userId,
    applications: applicationsData,
    status: "DRAFT",
  });

  return gist;
};

module.exports = generateGist;