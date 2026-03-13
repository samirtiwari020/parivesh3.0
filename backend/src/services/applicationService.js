// src/services/applicationService.js

const Application = require("../models/Application");

const createApplicationService = async (data, userId) => {
  const application = await Application.create({
    ...data,
    applicant: userId,
    status: "DRAFT"
  });

  return application;
};

const submitApplicationService = async (applicationId, userId) => {
  const application = await Application.findById(applicationId);

  if (!application) {
    throw new Error("Application not found");
  }

  application.status = "SUBMITTED";
  application.submittedAt = new Date();

  application.history.push({
    status: "SUBMITTED",
    updatedBy: userId,
    remarks: "Application submitted"
  });

  await application.save();

  return application;
};

const getApplicationByIdService = async (applicationId) => {
  return await Application.findById(applicationId)
    .populate("applicant", "name email")
    .populate("sector");
};

const updateApplicationService = async (applicationId, data) => {
  const application = await Application.findByIdAndUpdate(
    applicationId,
    data,
    { new: true, runValidators: true }
  );

  return application;
};

module.exports = {
  createApplicationService,
  submitApplicationService,
  getApplicationByIdService,
  updateApplicationService
};