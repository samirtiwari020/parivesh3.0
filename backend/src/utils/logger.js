// src/utils/logger.js

const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logFile = path.join(logDirectory, "app.log");

const logger = (level, message, meta = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  const formatted = JSON.stringify(logEntry) + "\n";

  fs.appendFileSync(logFile, formatted);
};

module.exports = {
  info: (msg, meta) => logger("INFO", msg, meta),
  warn: (msg, meta) => logger("WARN", msg, meta),
  error: (msg, meta) => logger("ERROR", msg, meta),
};