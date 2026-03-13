// src/services/scrutinyServices.js

const Scrutiny = require("../models/Scrutiny");
const Application = require("../models/Application");

// Start scrutiny
const startScrutinyService = async (applicationId, officerId) => {
  const application = await Application.findById(applicationId);

  if (!application) {
    throw new Error("Application not found");
  }

  const scrutiny = await Scrutiny.create({
    application: applicationId,
    scrutinizedBy: officerId,
    status: "UNDER_SCRUTINY",
    startedAt: new Date()
  });

  application.status = "UNDER_SCRUTINY";
  await application.save();

  return scrutiny;
};

// Get scrutiny by application
const getScrutinyByApplicationService = async (applicationId) => {
  const scrutiny = await Scrutiny.findOne({ application: applicationId })
    .populate("application")
    .populate("scrutinizedBy", "name email");

  return scrutiny;
};

// Add scrutiny remarks
const addScrutinyRemarksService = async (scrutinyId, remarks, officerId) => {
  const scrutiny = await Scrutiny.findById(scrutinyId);

  if (!scrutiny) {
    throw new Error("Scrutiny record not found");
  }

  scrutiny.remarks.push({
    comment: remarks,
    addedBy: officerId,
    addedAt: new Date()
  });

  await scrutiny.save();

  return scrutiny;
};

// Complete scrutiny
const completeScrutinyService = async (scrutinyId, decision) => {
  const scrutiny = await Scrutiny.findById(scrutinyId);

  if (!scrutiny) {
    throw new Error("Scrutiny record not found");
  }

  scrutiny.status = "COMPLETED";
  scrutiny.decision = decision;
  scrutiny.completedAt = new Date();

  await scrutiny.save();

  const application = await Application.findById(scrutiny.application);
  if (application) {
    application.status = decision === "APPROVED"
      ? "REFERRED_TO_MEETING"
      : "REJECTED";

    await application.save();
  }

  return scrutiny;
};

module.exports = {
  startScrutinyService,
  getScrutinyByApplicationService,
  addScrutinyRemarksService,
  completeScrutinyService
};