// src/services/documentServices.js

const Document = require("../models/Document");

// Create document
const createDocumentService = async (data, userId) => {
  const document = await Document.create({
    ...data,
    uploadedBy: userId
  });

  return document;
};

// Get document by ID
const getDocumentByIdService = async (documentId) => {
  const document = await Document.findById(documentId)
    .populate("uploadedBy", "name email");

  if (!document) {
    throw new Error("Document not found");
  }

  return document;
};

// Get documents by application
const getDocumentsByApplicationService = async (applicationId) => {
  const documents = await Document.find({
    application: applicationId
  }).populate("uploadedBy", "name email");

  return documents;
};

// Update document
const updateDocumentService = async (documentId, data) => {
  const document = await Document.findByIdAndUpdate(
    documentId,
    data,
    { new: true, runValidators: true }
  );

  if (!document) {
    throw new Error("Document not found");
  }

  return document;
};

// Delete document
const deleteDocumentService = async (documentId) => {
  const document = await Document.findByIdAndDelete(documentId);

  if (!document) {
    throw new Error("Document not found");
  }

  return document;
};

module.exports = {
  createDocumentService,
  getDocumentByIdService,
  getDocumentsByApplicationService,
  updateDocumentService,
  deleteDocumentService
};