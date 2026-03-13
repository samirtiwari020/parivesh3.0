// src/routes/meetingRoutes.js

const express = require("express");
const router = express.Router();

const {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  addApplicationToMeeting
} = require("../controllers/meetingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create meeting
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "OFFICER"),
  createMeeting
);

// Get all meetings
router.get(
  "/",
  authMiddleware,
  getAllMeetings
);

// Get single meeting
router.get(
  "/:id",
  authMiddleware,
  getMeetingById
);

// Update meeting
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "OFFICER"),
  updateMeeting
);

// Delete meeting
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteMeeting
);

// Add application to meeting
router.post(
  "/:id/add-application",
  authMiddleware,
  roleMiddleware("ADMIN", "OFFICER"),
  addApplicationToMeeting
);

module.exports = router;