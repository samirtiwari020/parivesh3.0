// src/controllers/templateController.js

const Template = require("../models/Template");

// Create Template
exports.createTemplate = async (req, res) => {
  try {
    const template = await Template.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Template creation failed",
      error: error.message
    });
  }
};

// Get all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find().populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: templates.length,
      templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
      error: error.message
    });
  }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found"
      });
    }

    res.status(200).json({
      success: true,
      template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching template",
      error: error.message
    });
  }
};

// Update template
exports.updateTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found"
      });
    }

    res.status(200).json({
      success: true,
      template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Template update failed",
      error: error.message
    });
  }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Template deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Template deletion failed",
      error: error.message
    });
  }
};