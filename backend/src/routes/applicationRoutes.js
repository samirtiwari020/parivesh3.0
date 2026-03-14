// src/routes/applicationRoutes.js

const express = require("express");
const router = express.Router();

const {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  submitApplication,
  reviewApplication,
  raiseEDS,
  resolveEDS
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("APPLICANT"), createApplication);

router.get("/", authMiddleware, getAllApplications);

router.get("/:id", authMiddleware, getApplicationById);

router.put("/:id", authMiddleware, roleMiddleware("APPLICANT", "ADMIN", "STATE_REVIEWER", "CENTRAL_REVIEWER"), updateApplication);

router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteApplication);

router.post("/:id/submit", authMiddleware, roleMiddleware("APPLICANT"), submitApplication);

router.post("/:id/review", authMiddleware, roleMiddleware("ADMIN", "STATE_REVIEWER", "CENTRAL_REVIEWER", "COMMITTEE_REVIEWER"), reviewApplication);

// EDS Routes
router.post("/:id/raise-eds", authMiddleware, roleMiddleware("ADMIN", "STATE_REVIEWER", "CENTRAL_REVIEWER"), raiseEDS);
router.post("/:id/resolve-eds", authMiddleware, roleMiddleware("APPLICANT"), resolveEDS);

module.exports = router;