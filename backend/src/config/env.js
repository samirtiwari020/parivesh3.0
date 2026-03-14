const dotenv = require("dotenv");
const path = require("path");

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const env = {
  PORT: process.env.PORT || 5000,

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET,

  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",

  NODE_ENV: process.env.NODE_ENV || "development",
};

module.exports = env;