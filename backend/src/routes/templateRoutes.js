// src/routes/templateRoutes.js

const express = require("express");
const router = express.Router();

const {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} = require("../controllers/templateController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create template
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createTemplate
);

// Get all templates
router.get(
  "/",
  authMiddleware,
  getAllTemplates
);

// Get template by ID
router.get(
  "/:id",
  authMiddleware,
  getTemplateById
);

// Update template
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateTemplate
);

// Delete template
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteTemplate
);

module.exports = router;