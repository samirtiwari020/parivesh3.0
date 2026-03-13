// src/models/Payment.js

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentGateway: {
      type: String,
      enum: ["RAZORPAY", "PAYTM", "STRIPE"],
      default: "RAZORPAY",
    },

    orderId: {
      type: String,
      required: true,
    },

    paymentId: {
      type: String,
    },

    signature: {
      type: String,
    },

    status: {
      type: String,
      enum: ["CREATED", "SUCCESS", "FAILED", "REFUNDED"],
      default: "CREATED",
    },

    paymentMethod: {
      type: String,
    },

    receiptUrl: {
      type: String,
    },

    paidAt: {
      type: Date,
    },

    failureReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);