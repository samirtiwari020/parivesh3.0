const Payment = require("../models/Payment");
const Application = require("../models/Application");

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const { applicationId, amount } = req.body;

    // Create payment record with status PENDING
    const payment = await Payment.create({
      application: applicationId,
      user: req.user._id,
      amount,
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment creation failed",
      error: error.message,
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Mark payment SUCCESS and store transactionId
    payment.status = "SUCCESS";
    payment.transactionId = transactionId;
    await payment.save();

    // Update application.paymentStatus to PAID
    await Application.findByIdAndUpdate(payment.application, {
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