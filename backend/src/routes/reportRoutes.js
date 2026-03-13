// src/routes/reportRoutes.js

const express = require("express");
const router = express.Router();

const {
  generateApplicationReport,
  generateMeetingReport,
  generatePaymentReport
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Application reports
router.get(
  "/applications",
  authMiddleware,
  roleMiddleware("ADMIN", "OFFICER"),
  generateApplicationReport
);

// Meeting reports
router.get(
  "/meetings",
  authMiddleware,
  roleMiddleware("ADMIN", "OFFICER"),
  generateMeetingReport
);

// Payment reports
router.get(
  "/payments",
  authMiddleware,
  roleMiddleware("ADMIN"),
  generatePaymentReport
);

module.exports = router;