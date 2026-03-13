// src/services/paymentServices.js

const Payment = require("../models/Payment");
const Application = require("../models/Application");

// Create payment
const createPaymentService = async (data, userId) => {
  const payment = await Payment.create({
    ...data,
    applicant: userId,
    status: "INITIATED",
    initiatedAt: new Date()
  });

  return payment;
};

// Verify payment success
const verifyPaymentService = async (paymentId, paymentDetails) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  payment.status = "SUCCESS";
  payment.transactionId = paymentDetails.transactionId;
  payment.paidAt = new Date();

  await payment.save();

  return payment;
};

// Handle failed payment
const failPaymentService = async (paymentId, reason) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  payment.status = "FAILED";
  payment.failureReason = reason;

  await payment.save();

  return payment;
};

// Get payment by ID
const getPaymentByIdService = async (paymentId) => {
  const payment = await Payment.findById(paymentId)
    .populate("application")
    .populate("applicant", "name email");

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

// Get payments for application
const getPaymentsByApplicationService = async (applicationId) => {
  const payments = await Payment.find({
    application: applicationId
  }).sort({ createdAt: -1 });

  return payments;
};

module.exports = {
  createPaymentService,
  verifyPaymentService,
  failPaymentService,
  getPaymentByIdService,
  getPaymentsByApplicationService
};