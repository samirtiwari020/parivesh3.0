// src/services/sectorServices.js

const Sector = require("../models/Sector");

// Create sector
const createSectorService = async (data, userId) => {
  const sector = await Sector.create({
    ...data,
    createdBy: userId
  });

  return sector;
};

// Get all sectors
const getAllSectorsService = async () => {
  const sectors = await Sector.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return sectors;
};

// Get sector by ID
const getSectorByIdService = async (sectorId) => {
  const sector = await Sector.findById(sectorId)
    .populate("createdBy", "name email");

  if (!sector) {
    throw new Error("Sector not found");
  }

  return sector;
};

// Update sector
const updateSectorService = async (sectorId, data) => {
  const sector = await Sector.findByIdAndUpdate(
    sectorId,
    data,
    { new: true, runValidators: true }
  );

  if (!sector) {
    throw new Error("Sector not found");
  }

  return sector;
};

// Delete sector
const deleteSectorService = async (sectorId) => {
  const sector = await Sector.findByIdAndDelete(sectorId);

  if (!sector) {
    throw new Error("Sector not found");
  }

  return sector;
};

module.exports = {
  createSectorService,
  getAllSectorsService,
  getSectorByIdService,
  updateSectorService,
  deleteSectorService
};