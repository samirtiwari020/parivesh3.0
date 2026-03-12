const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload folders exist
const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

createFolderIfNotExists("uploads/applications");
createFolderIfNotExists("uploads/documents");
createFolderIfNotExists("uploads/reports");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    let folder = "uploads/documents";

    if (req.body.type === "application") {
      folder = "uploads/applications";
    }

    if (req.body.type === "report") {
      folder = "uploads/reports";
    }

    cb(null, folder);
  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// File filter (security)
const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX, PNG, JPG files are allowed"), false);
  }
};

// Upload configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

module.exports = upload;