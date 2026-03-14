const fs = require("fs/promises");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const Application = require("../models/Application");
const Document = require("../models/Document");
const Gist = require("../models/Gist");
const { buildGistPrompt, extractTextWithGeminiOcr, generateGistFromGemini } = require("./geminiGistService");

const MIN_PARSED_TEXT_LENGTH = 500;

const buildLocation = (application) => {
  const pieces = [application.village, application.district, application.state]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  return pieces.length ? pieces.join(", ") : "N/A";
};

const normalizeExtractedText = (text) => {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const resolveDocumentPath = (filePath) => {
  if (!filePath) {
    return null;
  }

  return path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
};

const isPdfDocument = (document) => {
  return document.fileType === "application/pdf" || path.extname(document.filePath || "").toLowerCase() === ".pdf";
};

const parsePdfTextWithPdfParse = async (pdfBuffer) => {
  const parser = new PDFParse({ data: pdfBuffer });

  try {
    const result = await parser.getText();
    return normalizeExtractedText(result?.text);
  } finally {
    await parser.destroy();
  }
};

const needsOcrFallback = (text) => {
  const normalizedText = normalizeExtractedText(text);
  if (!normalizedText) {
    return true;
  }

  const alphaNumericCount = (normalizedText.match(/[A-Za-z0-9]/g) || []).length;
  return normalizedText.length < MIN_PARSED_TEXT_LENGTH || alphaNumericCount < 250;
};

const extractPdfText = async (document, index) => {
  const resolvedPath = resolveDocumentPath(document.filePath);

  if (!resolvedPath) {
    return `${index + 1}. ${document.documentName || "Unnamed PDF"}\nText extraction failed: file path not available.`;
  }

  try {
    const pdfBuffer = await fs.readFile(resolvedPath);
    let extractedText = await parsePdfTextWithPdfParse(pdfBuffer);
    let extractionMethod = "pdf-parse";

    if (needsOcrFallback(extractedText)) {
      try {
        const ocrResult = await extractTextWithGeminiOcr({
          buffer: pdfBuffer,
          mimeType: document.fileType || "application/pdf",
          fileName: document.documentName,
        });

        const ocrText = normalizeExtractedText(ocrResult.extractedText);

        if (ocrText && ocrText !== "NOT_READABLE") {
          extractedText = ocrText;
          extractionMethod = `gemini-ocr:${ocrResult.model}`;
        }
      } catch {
      }
    }

    return [
      `Document ${index + 1}: ${document.documentName || "Unnamed PDF"}`,
      `Extraction Method: ${extractionMethod}`,
      extractedText || "No readable text extracted from this PDF.",
    ].join("\n");
  } catch (error) {
    return [
      `Document ${index + 1}: ${document.documentName || "Unnamed PDF"}`,
      `Text extraction failed: ${error.message}`,
    ].join("\n");
  }
};

const buildDocumentText = async (documents) => {
  const pdfDocuments = documents.filter(isPdfDocument);

  if (!pdfDocuments.length) {
    return "Not Mentioned";
  }

  const extractedSections = await Promise.all(
    pdfDocuments.map((document, index) => extractPdfText(document, index))
  );

  return extractedSections.join("\n\n------------------------------\n\n");
};

const buildFallbackGist = ({ application, location, documentText }) => {
  const description = application.projectDescription || "Not Mentioned";
  const projectType = application.sector || application.clearanceType || "Not Mentioned";
  const organization = application.applicant?.organization || "Not Mentioned";
  const proponentName = application.applicant?.name || "Not Mentioned";
  const contactInformation = application.applicant?.email || application.applicant?.phone || "Not Mentioned";
  const observations = documentText === "Not Mentioned"
    ? "No readable PDF content was available for extraction at the time of GIST generation."
    : "PDF content was extracted and should be reviewed alongside this fallback summary for committee discussion.";

  return [
    "1. Project Overview",
    `${application.projectName || "Not Mentioned"} is a ${application.category || "Not Mentioned"} category project at ${location}. Purpose and project description: ${description}.`,
    "",
    "2. Project Proponent Details",
    `- Name of Proponent: ${proponentName}`,
    `- Organization: ${organization}`,
    `- Contact Information (if available): ${contactInformation}`,
    "",
    "3. Key Project Details",
    "",
    "| Parameter | Details |",
    "|-----------|--------|",
    `| Project Type | ${projectType} |`,
    `| Category | ${application.category || "Not Mentioned"} |`,
    `| Location | ${location} |`,
    `| Area / Capacity | ${application.projectCost ? `Project cost: ${application.projectCost}` : "Not Mentioned"} |`,
    "| Mining / Construction Type | Not Mentioned |",
    "",
    "4. Environmental Impact Summary",
    "Potential impacts on water, air, biodiversity, and nearby settlements/forest areas should be assessed in detail from the submitted proposal documents and during committee appraisal. Specific quantified impacts are Not Mentioned in the fallback summary.",
    "",
    "5. Mitigation Measures",
    "- Plantation: Not Mentioned",
    "- Pollution control: To be confirmed from proposal documents",
    "- Monitoring systems: To be confirmed from EMP / monitoring plan",
    "- Sustainable practices: Not Mentioned",
    "",
    "6. Compliance Status",
    "",
    "| Requirement | Status |",
    "|------------|-------|",
    "| Environmental Clearance | Under Review |",
    "| Mining Plan Approval | Not Mentioned |",
    "| NOC from Local Authority | Not Mentioned |",
    "| Environmental Management Plan | To be verified from submitted documents |",
    "",
    "7. Key Observations",
    `- ${observations}`,
    "- Detailed committee scrutiny is required before final recommendation.",
    "",
    "8. Committee Recommendation",
    "Proposal may be placed before the committee for detailed discussion with safeguards and document verification.",
  ].join("\n");
};

const inferRecommendation = (gistText) => {
  const recommendationSectionMatch = gistText.match(
    /8\.\s*Committee Recommendation\s*([\s\S]*)$/i
  );

  const recommendationText = (recommendationSectionMatch?.[1] || gistText).toLowerCase();

  if (recommendationText.includes("needs clarification") || recommendationText.includes("requires safeguards")) {
    return "DEFERRED";
  }

  if (recommendationText.includes("reject") || recommendationText.includes("not recommend")) {
    return "NOT_RECOMMENDED";
  }

  if (recommendationText.includes("approval") || recommendationText.includes("approve") || recommendationText.includes("recommended")) {
    return "RECOMMENDED";
  }

  return "DEFERRED";
};

const generateOrUpdateApplicationGist = async ({ applicationId, reviewedBy }) => {
  const application = await Application.findById(applicationId)
    .populate("applicant", "name organization")
    .populate("gistId");

  if (!application) {
    throw new Error("Application not found for GIST generation");
  }

  const documents = await Document.find({
    application: application._id,
    isActive: true,
  })
    .sort({ createdAt: 1 })
    .select("documentName documentType remarks filePath fileType");

  const location = buildLocation(application);
  const documentText = await buildDocumentText(documents);

  const prompt = buildGistPrompt({
    projectTitle: application.projectName,
    category: application.category,
    location,
    documentText,
  });

  let gistText;
  let gistRemark = "Auto-generated after Central Reviewer approval";

  try {
    const geminiResult = await generateGistFromGemini(prompt);
    gistText = geminiResult.gistText;
    gistRemark = `Auto-generated after Central Reviewer approval using ${geminiResult.model}`;
  } catch (error) {
    gistText = buildFallbackGist({
      application,
      location,
      documentText,
    });
    gistRemark = `Auto-generated fallback GIST after Central Reviewer approval. Gemini unavailable: ${error.message}`;
  }

  const recommendation = inferRecommendation(gistText);

  const gistPayload = {
    preparedBy: reviewedBy,
    applications: [
      {
        application: application._id,
        summary: gistText,
        recommendation,
      },
    ],
    remarks: gistRemark,
    status: "DRAFT",
  };

  if (application.meetingId) {
    gistPayload.meeting = application.meetingId;
  }

  let gist;

  if (application.gistId?._id) {
    gist = await Gist.findByIdAndUpdate(application.gistId._id, gistPayload, {
      new: true,
      runValidators: true,
    });
  } else {
    gist = await Gist.create(gistPayload);
  }

  if (!gist) {
    throw new Error("Failed to persist generated gist");
  }

  return gist;
};

module.exports = {
  generateOrUpdateApplicationGist,
};
