const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const documentRoutes = require("./routes/documentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const edsRoutes = require("./routes/edsRoutes");
const scrutinyRoutes = require("./routes/scrutinyRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const gistRoutes = require("./routes/gistRoutes");
const momRoutes = require("./routes/momRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const sectorRoutes = require("./routes/sectorRoutes");
const templateRoutes = require("./routes/templateRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/eds", edsRoutes);
app.use("/api/scrutiny", scrutinyRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/gist", gistRoutes);
app.use("/api/mom", momRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/sectors", sectorRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/admin", adminRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "PARIVESH Backend API Running 🚀"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;