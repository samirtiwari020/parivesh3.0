const Razorpay = require("razorpay");
const env = require("./env");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_SECRET,
});

module.exports = razorpay;