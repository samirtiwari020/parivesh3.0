// src/routes/documentRoutes.js

const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getDocumentsByApplication,
  getDocumentById,
  deleteDocument,
  downloadDocument
} = require("../controllers/documentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

// Upload document
router.post(
  "/upload",
  authMiddleware,
  roleMiddleware("APPLICANT"),
  uploadMiddleware.single("document"),
  uploadDocument
);

// Get all documents of an application
router.get(
  "/application/:applicationId",
  authMiddleware,
  getDocumentsByApplication
);

// Get single document
router.get(
  "/:id",
  authMiddleware,
  getDocumentById
);

// Download document
router.get(
  "/download/:id",
  authMiddleware,
  downloadDocument
);

// Delete document
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("APPLICANT", "ADMIN"),
  deleteDocument
);

module.exports = router;