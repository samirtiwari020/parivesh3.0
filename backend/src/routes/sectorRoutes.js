// src/routes/sectorRoutes.js

const express = require("express");
const router = express.Router();

const {
  createSector,
  getAllSectors,
  getSectorById,
  updateSector,
  deleteSector
} = require("../controllers/sectorController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create sector
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createSector
);

// Get all sectors
router.get(
  "/",
  authMiddleware,
  getAllSectors
);

// Get sector by ID
router.get(
  "/:id",
  authMiddleware,
  getSectorById
);

// Update sector
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateSector
);

// Delete sector
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteSector
);

module.exports = router;