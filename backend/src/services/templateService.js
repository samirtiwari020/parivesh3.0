// src/services/templateServices.js

const Template = require("../models/Template");

// Create Template
const createTemplateService = async (data, userId) => {
  const template = await Template.create({
    ...data,
    createdBy: userId
  });

  return template;
};

// Get all Templates
const getAllTemplatesService = async () => {
  const templates = await Template.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return templates;
};

// Get Template by ID
const getTemplateByIdService = async (templateId) => {
  const template = await Template.findById(templateId)
    .populate("createdBy", "name email");

  if (!template) {
    throw new Error("Template not found");
  }

  return template;
};

// Update Template
const updateTemplateService = async (templateId, data) => {
  const template = await Template.findByIdAndUpdate(
    templateId,
    data,
    { new: true, runValidators: true }
  );

  if (!template) {
    throw new Error("Template not found");
  }

  return template;
};

// Delete Template
const deleteTemplateService = async (templateId) => {
  const template = await Template.findByIdAndDelete(templateId);

  if (!template) {
    throw new Error("Template not found");
  }

  return template;
};

module.exports = {
  createTemplateService,
  getAllTemplatesService,
  getTemplateByIdService,
  updateTemplateService,
  deleteTemplateService
};