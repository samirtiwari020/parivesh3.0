// src/utils/paymentHelper.js

const crypto = require("crypto");

const verifyRazorpaySignature = (orderId, paymentId, signature, secret) => {
  const body = orderId + "|" + paymentId;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === signature;
};

const generateReceiptId = () => {
  return `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const calculateFee = (applicationType) => {
  const feeStructure = {
    NEW_APPLICATION: 1000,
    EXPANSION: 1500,
    RENEWAL: 800,
  };

  return feeStructure[applicationType] || 1000;
};

module.exports = {
  verifyRazorpaySignature,
  generateReceiptId,
  calculateFee,
};