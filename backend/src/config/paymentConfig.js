const Razorpay = require("razorpay");
const env = require("./env");

const getRazorpayClient = () => {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_SECRET) {
    const error = new Error("Razorpay is not configured");
    error.status = 503;
    throw error;
  }

  return new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_SECRET,
  });
};

module.exports = getRazorpayClient;