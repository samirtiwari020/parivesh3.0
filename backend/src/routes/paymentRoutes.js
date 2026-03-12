// src/routes/paymentRoutes.js

const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
  getPaymentHistory
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Create payment order (Applicant pays application fee)
router.post(
  "/create-order",
  authMiddleware,
  roleMiddleware("APPLICANT"),
  createOrder
);

// Verify payment after Razorpay/Payment gateway response
router.post(
  "/verify",
  authMiddleware,
  roleMiddleware("APPLICANT"),
  verifyPayment
);

// Get logged-in user's payment history
router.get(
  "/history",
  authMiddleware,
  getPaymentHistory
);

module.exports = router;