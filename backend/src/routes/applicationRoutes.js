// src/routes/applicationRoutes.js

const express = require("express");
const router = express.Router();

const {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  submitApplication
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, roleMiddleware("APPLICANT"), createApplication);

router.get("/", authMiddleware, getAllApplications);

router.get("/:id", authMiddleware, getApplicationById);

router.put("/:id", authMiddleware, roleMiddleware("APPLICANT", "ADMIN"), updateApplication);

router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteApplication);

router.post("/:id/submit", authMiddleware, roleMiddleware("APPLICANT"), submitApplication);

module.exports = router;