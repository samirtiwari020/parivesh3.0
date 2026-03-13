// src/routes/momRoutes.js

const express = require("express");
const router = express.Router();

const {
  generateMoM,
  getMoMByMeeting,
  getMoMById,
  finalizeMoM
} = require("../controllers/momController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

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

router.put(
  "/finalize/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  finalizeMoM
);

module.exports = router;