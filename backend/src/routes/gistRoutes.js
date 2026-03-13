// src/routes/gistRoutes.js

const express = require("express");
const router = express.Router();

const {
  generateGist,
  getGistByMeeting,
  getGistById,
  updateGist,
  finalizeGist
} = require("../controllers/gistController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/generate/:meetingId",
  authMiddleware,
  roleMiddleware("ADMIN", "OFFICER"),
  generateGist
);

router.get(
  "/meeting/:meetingId",
  authMiddleware,
  getGistByMeeting
);

router.get(
  "/:id",
  authMiddleware,
  getGistById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "OFFICER"),
  updateGist
);

router.put(
  "/finalize/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  finalizeGist
);

module.exports = router;