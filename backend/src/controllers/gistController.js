// src/controllers/gistController.js

const PDFDocument = require("pdfkit");
const Gist = require("../models/Gist");
const Meeting = require("../models/Meeting");

const PDF_THEME = {
  primary: "#1a5c38",
  primaryTint: "#e8f5e9",
  border: "#cfd8d3",
  rowAlt: "#f8fbf8",
  text: "#1f2937",
  muted: "#5f6b66",
};

const parseGistSections = (summaryText) => {
  const lines = String(summaryText || "").replace(/\r/g, "").split("\n");
  const sections = [];
  let currentSection = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const headerMatch = line.match(/^(\d+\.\s+.+)$/);

    if (headerMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }

      currentSection = {
        title: headerMatch[1],
        lines: [],
      };
      continue;
    }

    if (!currentSection) {
      currentSection = {
        title: "GIST Summary",
        lines: [],
      };
    }

    currentSection.lines.push(rawLine);
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections.map((section) => ({
    title: section.title,
    lines: section.lines,
  }));
};

const parseMarkdownTableRows = (lines) => {
  const rows = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line.startsWith("|") || !line.endsWith("|")) {
      continue;
    }

    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (!cells.length || cells.every((cell) => /^[-: ]+$/.test(cell))) {
      continue;
    }

    rows.push(cells);
  }

  return rows;
};

const ensureSpace = (doc, heightNeeded) => {
  const bottomLimit = doc.page.height - doc.page.margins.bottom;
  if (doc.y + heightNeeded > bottomLimit) {
    doc.addPage();
  }
};

const drawPageFrame = (doc, projectName, generatedAt) => {
  const left = doc.page.margins.left;
  const top = doc.page.margins.top;
  const contentWidth = doc.page.width - left - doc.page.margins.right;

  doc
    .save()
    .rect(left, top, contentWidth, 54)
    .fill(PDF_THEME.primary)
    .restore();

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("MINISTRY OF ENVIRONMENT, FOREST AND CLIMATE CHANGE", left + 12, top + 10, {
      width: contentWidth - 24,
      align: "center",
    });

  doc
    .font("Helvetica")
    .fontSize(9)
    .text("General Information Summary Table (GIST)", left + 12, top + 30, {
      width: contentWidth - 24,
      align: "center",
    });

  doc
    .fillColor(PDF_THEME.muted)
    .font("Helvetica")
    .fontSize(8)
    .text(projectName, left, top + 62, {
      width: contentWidth,
      align: "left",
    })
    .text(`Generated on ${generatedAt}`, left, top + 62, {
      width: contentWidth,
      align: "right",
    });

  doc.y = top + 82;
};

const drawFullWidthRow = (doc, text, options = {}) => {
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const paddingX = options.paddingX || 10;
  const paddingY = options.paddingY || 7;
  const fontSize = options.fontSize || 10;
  const fontName = options.fontName || "Helvetica";

  doc.font(fontName).fontSize(fontSize);
  const textHeight = doc.heightOfString(text, { width: width - paddingX * 2, align: options.align || "left" });
  const rowHeight = Math.max(options.minHeight || 0, textHeight + paddingY * 2);

  ensureSpace(doc, rowHeight + 2);

  doc
    .save()
    .rect(left, doc.y, width, rowHeight)
    .fill(options.fillColor || "#ffffff")
    .stroke(options.strokeColor || PDF_THEME.border)
    .restore();

  doc
    .fillColor(options.textColor || PDF_THEME.text)
    .font(fontName)
    .fontSize(fontSize)
    .text(text, left + paddingX, doc.y + paddingY, {
      width: width - paddingX * 2,
      align: options.align || "left",
    });

  doc.y += rowHeight;
};

const drawTwoColumnRow = (doc, label, value, options = {}) => {
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const labelWidth = options.labelWidth || 170;
  const valueWidth = width - labelWidth;
  const paddingX = 8;
  const paddingY = 7;

  doc.font("Helvetica-Bold").fontSize(9);
  const labelHeight = doc.heightOfString(label, { width: labelWidth - paddingX * 2 });
  doc.font(options.valueFont || "Helvetica").fontSize(10);
  const valueHeight = doc.heightOfString(value, { width: valueWidth - paddingX * 2 });
  const rowHeight = Math.max(labelHeight, valueHeight) + paddingY * 2;

  ensureSpace(doc, rowHeight + 2);

  doc.save();
  doc.rect(left, doc.y, labelWidth, rowHeight).fill(options.labelFill || PDF_THEME.primaryTint).stroke(PDF_THEME.border);
  doc.rect(left + labelWidth, doc.y, valueWidth, rowHeight).fill(options.valueFill || "#ffffff").stroke(PDF_THEME.border);
  doc.restore();

  doc
    .fillColor(PDF_THEME.primary)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(label, left + paddingX, doc.y + paddingY, {
      width: labelWidth - paddingX * 2,
    });

  doc
    .fillColor(PDF_THEME.text)
    .font(options.valueFont || "Helvetica")
    .fontSize(10)
    .text(value, left + labelWidth + paddingX, doc.y + paddingY, {
      width: valueWidth - paddingX * 2,
    });

  doc.y += rowHeight;
};

const drawMatrixTable = (doc, rows) => {
  if (!rows.length) {
    return;
  }

  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const columnCount = rows[0].length;
  const columnWidths = columnCount === 2
    ? [Math.min(190, width * 0.38), width - Math.min(190, width * 0.38)]
    : Array.from({ length: columnCount }, () => width / columnCount);
  const paddingX = 8;
  const paddingY = 7;

  rows.forEach((row, rowIndex) => {
    const normalizedRow = row.concat(Array.from({ length: Math.max(0, columnCount - row.length) }, () => ""));
    const isHeader = rowIndex === 0;

    doc.font(isHeader ? "Helvetica-Bold" : "Helvetica").fontSize(9.5);
    const rowHeight = normalizedRow.reduce((maxHeight, cell, cellIndex) => {
      const height = doc.heightOfString(cell || "-", {
        width: columnWidths[cellIndex] - paddingX * 2,
      });
      return Math.max(maxHeight, height);
    }, 0) + paddingY * 2;

    ensureSpace(doc, rowHeight + 2);

    let currentX = left;
    normalizedRow.forEach((cell, cellIndex) => {
      doc.save();
      doc
        .rect(currentX, doc.y, columnWidths[cellIndex], rowHeight)
        .fill(isHeader ? PDF_THEME.primaryTint : rowIndex % 2 === 0 ? PDF_THEME.rowAlt : "#ffffff")
        .stroke(PDF_THEME.border);
      doc.restore();

      doc
        .fillColor(isHeader ? PDF_THEME.primary : PDF_THEME.text)
        .font(isHeader ? "Helvetica-Bold" : "Helvetica")
        .fontSize(9.5)
        .text(cell || "-", currentX + paddingX, doc.y + paddingY, {
          width: columnWidths[cellIndex] - paddingX * 2,
        });

      currentX += columnWidths[cellIndex];
    });

    doc.y += rowHeight;
  });
};

const renderSection = (doc, section) => {
  const nonEmptyLines = section.lines.map((line) => line.trim()).filter(Boolean);
  const tableRows = parseMarkdownTableRows(section.lines);
  const narrativeLines = nonEmptyLines.filter((line) => !(line.startsWith("|") && line.endsWith("|")));

  drawFullWidthRow(doc, section.title, {
    fillColor: PDF_THEME.primary,
    textColor: "#ffffff",
    fontName: "Helvetica-Bold",
    fontSize: 11,
    paddingY: 8,
  });

  if (tableRows.length) {
    drawMatrixTable(doc, tableRows);
  }

  const kvLines = [];
  const noteLines = [];

  for (const line of narrativeLines) {
    const cleanLine = line.replace(/^[-*]\s+/, "").trim();
    const colonIndex = cleanLine.indexOf(":");

    if (colonIndex > 0) {
      kvLines.push({
        label: cleanLine.slice(0, colonIndex).trim(),
        value: cleanLine.slice(colonIndex + 1).trim() || "Not Mentioned",
      });
    } else {
      noteLines.push(cleanLine);
    }
  }

  kvLines.forEach((entry) => {
    drawTwoColumnRow(doc, entry.label, entry.value);
  });

  if (noteLines.length) {
    drawTwoColumnRow(doc, "Details", noteLines.join("\n\n"), {
      labelWidth: 120,
      valueFont: "Helvetica",
    });
  }

  doc.moveDown(0.5);
};

// Generate Gist
exports.generateGist = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId).populate("applications");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    const gist = await Gist.create({
      meeting: meeting._id,
      preparedBy: req.user._id,
      applications: meeting.applications.map(app => ({
        application: app._id,
        summary: `Discussion held for ${app.projectName}`,
        recommendation: "DEFERRED"
      })),
      status: "DRAFT"
    });

    res.status(201).json({
      success: true,
      gist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gist generation failed",
      error: error.message
    });
  }
};

// Get Gist by Meeting
exports.getGistByMeeting = async (req, res) => {
  try {
    const gist = await Gist.findOne({ meeting: req.params.meetingId })
      .populate("meeting")
      .populate("applications.application");

    res.status(200).json({
      success: true,
      gist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gist",
      error: error.message
    });
  }
};

// Get Gist by ID
exports.getGistById = async (req, res) => {
  try {
    const gist = await Gist.findById(req.params.id)
      .populate("meeting")
      .populate("applications.application");

    if (!gist) {
      return res.status(404).json({
        success: false,
        message: "Gist not found"
      });
    }

    res.status(200).json({
      success: true,
      gist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching gist",
      error: error.message
    });
  }
};

// Update Gist
exports.updateGist = async (req, res) => {
  try {
    const gist = await Gist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!gist) {
      return res.status(404).json({
        success: false,
        message: "Gist not found"
      });
    }

    res.status(200).json({
      success: true,
      gist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gist update failed",
      error: error.message
    });
  }
};

// Finalize Gist
exports.finalizeGist = async (req, res) => {
  try {
    const gist = await Gist.findById(req.params.id);

    if (!gist) {
      return res.status(404).json({
        success: false,
        message: "Gist not found"
      });
    }

    gist.status = "FINALIZED";
    gist.finalizedAt = new Date();
    await gist.save();

    res.status(200).json({
      success: true,
      gist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to finalize gist",
      error: error.message
    });
  }
};

// Download Gist as PDF
exports.downloadGistPdf = async (req, res) => {
  try {
    const gist = await Gist.findById(req.params.id)
      .populate("preparedBy", "name email")
      .populate("applications.application", "projectName category state district");

    if (!gist) {
      return res.status(404).json({ success: false, message: "Gist not found" });
    }

    const appEntry = gist.applications?.[0];
    const application = appEntry?.application;
    const summaryText = appEntry?.summary || "No summary available.";
    const recommendation = appEntry?.recommendation || "DEFERRED";
    const projectName = application?.projectName || "Unknown Project";
    const generatedAt = new Date(gist.updatedAt).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
    });
    const sections = parseGistSections(summaryText);

    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: 50,
        bottom: 52,
        left: 45,
        right: 45,
      },
    });
    const safeFileName = projectName.replace(/[^a-z0-9_\-\s]/gi, "_").replace(/\s+/g, "_");
    const pdfChunks = [];
    const pdfBufferPromise = new Promise((resolve, reject) => {
      doc.on("data", (chunk) => pdfChunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(pdfChunks)));
      doc.on("error", reject);
    });

    drawPageFrame(doc, projectName, generatedAt);
    doc.on("pageAdded", () => {
      drawPageFrame(doc, projectName, generatedAt);
    });

    drawFullWidthRow(doc, projectName, {
      fillColor: "#f3faf4",
      textColor: PDF_THEME.primary,
      fontName: "Helvetica-Bold",
      fontSize: 12,
      paddingY: 9,
      align: "center",
    });

    drawTwoColumnRow(doc, "Recommendation", recommendation);
    drawTwoColumnRow(doc, "Status", gist.status || "DRAFT");
    drawTwoColumnRow(doc, "Prepared By", gist.preparedBy?.name || gist.preparedBy?.email || "System Generated");

    sections.forEach((section) => {
      renderSection(doc, section);
    });

    doc.end();

    const pdfBuffer = await pdfBufferPromise;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="GIST_${safeFileName}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    if (res.headersSent) {
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to generate GIST PDF",
      error: error.message,
    });
  }
};