// src/controllers/paymentController.js

const razorpay = require("../config/paymentConfig");
const Payment = require("../models/Payment");
const Application = require("../models/Application");

// Create payment order
exports.createOrder = async (req, res) => {
  try {
    const { applicationId, amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      application: applicationId,
      applicant: req.user._id,
      amount,
      orderId: order.id,
      status: "CREATED",
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, applicationId } = req.body;

    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    payment.paymentId = paymentId;
    payment.signature = signature;
    payment.status = "SUCCESS";
    payment.paidAt = new Date();

    await payment.save();

    await Application.findByIdAndUpdate(applicationId, {
      paymentStatus: "PAID",
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({
      applicant: req.user._id,
    }).populate("application");

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: error.message,
    });
  }
};