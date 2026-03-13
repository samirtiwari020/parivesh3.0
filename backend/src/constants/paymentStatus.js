// src/constants/paymentStatus.js

const PAYMENT_STATUS = {
  PENDING: "PENDING",
  INITIATED: "INITIATED",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
};

const isSuccessfulPayment = (status) => {
  return status === PAYMENT_STATUS.SUCCESS;
};

const isFailedPayment = (status) => {
  return status === PAYMENT_STATUS.FAILED;
};

module.exports = {
  PAYMENT_STATUS,
  isSuccessfulPayment,
  isFailedPayment
};