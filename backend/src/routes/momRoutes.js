// src/routes/momRoutes.js

const express = require("express");
const router = express.Router();

const {
  generateMoM,
  getMoMByMeeting,
  getMoMById,
  finalizeMoM,
  getMoMTeamDashboard,
  getMoMTeamApplicationRecord,
  editApplicationGist,
  convertGistToMoMForApplication,
  publishMoMForApplication,
  downloadMoMPdf,
} = require("../controllers/momController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const momTeamRoles = ["COMMITTEE_REVIEWER", "MOM_SECRETARIAT", "ADMIN"];

router.get(
  "/team/dashboard",
  authMiddleware,
  roleMiddleware(...momTeamRoles),
  getMoMTeamDashboard
);

router.get(
  "/team/application/:applicationId",
  authMiddleware,
  roleMiddleware(...momTeamRoles),
  getMoMTeamApplicationRecord
);

router.put(
  "/team/application/:applicationId/gist",
  authMiddleware,
  roleMiddleware(...momTeamRoles),
  editApplicationGist
);

router.post(
  "/team/application/:applicationId/convert",
  authMiddleware,
  roleMiddleware(...momTeamRoles),
  convertGistToMoMForApplication
);

router.post(
  "/team/application/:applicationId/publish",
  authMiddleware,
  roleMiddleware(...momTeamRoles),
  publishMoMForApplication
);

router.post(
  "/generate/:meetingId",
  authMiddleware,
  roleMiddleware("ADMIN", "OFFICER"),
  generateMoM
);

router.get(
  "/meeting/:meetingId",
  authMiddleware,
  getMoMByMeeting
);

router.get(
  "/:id",
  authMiddleware,
  getMoMById
);

router.get(
  "/:id/pdf",
  authMiddleware,
  downloadMoMPdf
);

router.put(
  "/finalize/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  finalizeMoM
);

module.exports = router;