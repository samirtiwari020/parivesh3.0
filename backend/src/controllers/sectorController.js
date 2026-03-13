// src/controllers/sectorController.js

const Sector = require("../models/Sector");

// Create sector
exports.createSector = async (req, res) => {
  try {
    const sector = await Sector.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      sector
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sector creation failed",
      error: error.message
    });
  }
};

// Get all sectors
exports.getAllSectors = async (req, res) => {
  try {
    const sectors = await Sector.find().populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: sectors.length,
      sectors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sectors",
      error: error.message
    });
  }
};

// Get sector by ID
exports.getSectorById = async (req, res) => {
  try {
    const sector = await Sector.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!sector) {
      return res.status(404).json({
        success: false,
        message: "Sector not found"
      });
    }

    res.status(200).json({
      success: true,
      sector
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sector",
      error: error.message
    });
  }
};

// Update sector
exports.updateSector = async (req, res) => {
  try {
    const sector = await Sector.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sector) {
      return res.status(404).json({
        success: false,
        message: "Sector not found"
      });
    }

    res.status(200).json({
      success: true,
      sector
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sector update failed",
      error: error.message
    });
  }
};

// Delete sector
exports.deleteSector = async (req, res) => {
  try {
    const sector = await Sector.findByIdAndDelete(req.params.id);

    if (!sector) {
      return res.status(404).json({
        success: false,
        message: "Sector not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Sector deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sector deletion failed",
      error: error.message
    });
  }
};