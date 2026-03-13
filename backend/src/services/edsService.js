// src/services/edsServices.js

const EDS = require("../models/EDS");
const Application = require("../models/Application");

// Raise EDS
const raiseEDSService = async (applicationId, data, officerId) => {
  const application = await Application.findById(applicationId);

  if (!application) {
    throw new Error("Application not found");
  }

  const eds = await EDS.create({
    application: applicationId,
    raisedBy: officerId,
    queries: data.queries,
    status: "RAISED"
  });

  application.status = "EDS_RAISED";
  await application.save();

  return eds;
};

// Get EDS by application
const getEDSByApplicationService = async (applicationId) => {
  const edsList = await EDS.find({
    application: applicationId
  })
    .populate("raisedBy", "name email")
    .populate("application");

  return edsList;
};

// Respond to EDS
const respondEDSService = async (edsId, responseData, userId) => {
  const eds = await EDS.findById(edsId);

  if (!eds) {
    throw new Error("EDS not found");
  }

  eds.responses.push({
    response: responseData.response,
    respondedBy: userId,
    respondedAt: new Date()
  });

  eds.status = "RESPONDED";

  await eds.save();

  const application = await Application.findById(eds.application);
  if (application) {
    application.status = "RESUBMITTED";
    await application.save();
  }

  return eds;
};

// Close EDS
const closeEDSService = async (edsId) => {
  const eds = await EDS.findByIdAndUpdate(
    edsId,
    { status: "CLOSED" },
    { new: true }
  );

  if (!eds) {
    throw new Error("EDS not found");
  }

  return eds;
};

module.exports = {
  raiseEDSService,
  getEDSByApplicationService,
  respondEDSService,
  closeEDSService
};