// src/routes/edsRoutes.js

const express = require("express");
const router = express.Router();

const {
  raiseEDS,
  respondEDS,
  getEDSByApplication,
  closeEDS
} = require("../controllers/edsController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Raise EDS (Scrutiny officer)
router.post(
  "/raise",
  authMiddleware,
  roleMiddleware("SCRUTINY_OFFICER", "ADMIN"),
  raiseEDS
);

// Respond to EDS (Applicant)
router.put(
  "/respond/:id",
  authMiddleware,
  roleMiddleware("APPLICANT"),
  respondEDS
);

// Get EDS by application
router.get(
  "/application/:applicationId",
  authMiddleware,
  getEDSByApplication
);

// Close EDS (Officer/Admin)
router.put(
  "/close/:id",
  authMiddleware,
  roleMiddleware("SCRUTINY_OFFICER", "ADMIN"),
  closeEDS
);

module.exports = router;