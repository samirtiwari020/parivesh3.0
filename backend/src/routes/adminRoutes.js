// src/routes/adminRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createStaffUser,
  getAllUsers,
  deleteUser,
  updateUser
} = require("../controllers/userController");

const {
  getAllApplications,
  updateApplication,
  deleteApplication
} = require("../controllers/applicationController");

const {
  getActivityLogs,
} = require("../controllers/adminController");

const {
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting
} = require("../controllers/meetingController");

// Protect all admin routes
router.use(authMiddleware, roleMiddleware("ADMIN"));

/* USER MANAGEMENT */
router.post("/users/staff", createStaffUser);
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

/* APPLICATION MANAGEMENT */
router.get("/applications", getAllApplications);
router.put("/applications/:id", updateApplication);
router.delete("/applications/:id", deleteApplication);

/* ACTIVITY LOGS */
router.get("/logs", getActivityLogs);

/* MEETING MANAGEMENT */
router.get("/meetings", getAllMeetings);
router.post("/meetings", createMeeting);
router.put("/meetings/:id", updateMeeting);
router.delete("/meetings/:id", deleteMeeting);

module.exports = router;