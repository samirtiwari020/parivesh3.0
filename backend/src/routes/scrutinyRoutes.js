// src/routes/scrutinyRoutes.js

const express = require("express");
const router = express.Router();

const {
  assignApplicationForScrutiny,
  getApplicationsForScrutiny,
  updateScrutinyStatus,
  getScrutinyDetails
} = require("../controllers/scrutinyController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get applications assigned for scrutiny
router.get(
  "/applications",
  authMiddleware,
  roleMiddleware("SCRUTINY_OFFICER", "ADMIN"),
  getApplicationsForScrutiny
);

// Assign application for scrutiny
router.post(
  "/assign",
  authMiddleware,
  roleMiddleware("ADMIN"),
  assignApplicationForScrutiny
);

// Update scrutiny status
router.put(
  "/:applicationId",
  authMiddleware,
  roleMiddleware("SCRUTINY_OFFICER", "ADMIN"),
  updateScrutinyStatus
);

// Get scrutiny details
router.get(
  "/:applicationId",
  authMiddleware,
  roleMiddleware("SCRUTINY_OFFICER", "ADMIN"),
  getScrutinyDetails
);

module.exports = router;