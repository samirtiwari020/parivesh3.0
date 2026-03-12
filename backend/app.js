const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const documentRoutes = require("./src/routes/documentRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const edsRoutes = require("./src/routes/edsRoutes");
const scrutinyRoutes = require("./src/routes/scrutinyRoutes");
const meetingRoutes = require("./src/routes/meetingRoutes");
const gistRoutes = require("./src/routes/gistRoutes");
const momRoutes = require("./src/routes/momRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const sectorRoutes = require("./src/routes/sectorRoutes");
const templateRoutes = require("./src/routes/templateRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

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

app.get("/", (req, res) => {
  res.json({ message: "PARIVESH Backend API Running 🚀" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;