const express = require("express");
const router = express.Router();

const {
  createPayment,
  verifyPayment
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create payment
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("APPLICANT"),
  createPayment
);

// Verify payment
router.post(
  "/verify",
  authMiddleware,
  roleMiddleware("APPLICANT"),
  verifyPayment
);

module.exports = router;