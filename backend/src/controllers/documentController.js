const fs = require("fs");
const path = require("path");
const Document = require("../models/Document");
const Application = require("../models/Application");

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    const document = await Document.create({
      application: req.body.applicationId,
      uploadedBy: req.user._id,
      documentName: req.body.documentName,
      documentType: req.body.documentType,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    });

    await Application.findByIdAndUpdate(
      req.body.applicationId,
      { $push: { documents: document._id } }
    );

    res.status(201).json({
      success: true,
      document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Document upload failed",
      error: error.message,
    });
  }
};

// Get documents by application
exports.getDocumentsByApplication = async (req, res) => {
  try {
    const documents = await Document.find({
      application: req.params.applicationId,
    }).populate("uploadedBy", "name email role");

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

// Get document by ID
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("application")
      .populate("uploadedBy", "name email");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching document",
      error: error.message,
    });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const resolvedPath = path.resolve(document.filePath);

    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({
        success: false,
        message: "Document file not found",
      });
    }

    return res.download(resolvedPath, document.documentName);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Document download failed",
      error: error.message,
    });
  }
};

// Verify document
exports.verifyDocument = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const document = await Document.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: status,
        verifiedBy: req.user._id,
        remarks,
      },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Document verification failed",
      error: error.message,
    });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    await Application.findByIdAndUpdate(
      document.application,
      { $pull: { documents: document._id } }
    );

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Document deletion failed",
      error: error.message,
    });
  }
};