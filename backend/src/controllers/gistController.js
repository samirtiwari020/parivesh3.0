// src/controllers/gistController.js

const PDFDocument = require("pdfkit");
const Gist = require("../models/Gist");
const Meeting = require("../models/Meeting");

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

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const safeFileName = projectName.replace(/[^a-z0-9_\-\s]/gi, "_").replace(/\s+/g, "_");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="GIST_${safeFileName}.pdf"`
    );
    doc.pipe(res);

    // ── Header ────────────────────────────────────────────────────────
    doc
      .rect(50, 40, doc.page.width - 100, 70)
      .fillAndStroke("#1a5c38", "#1a5c38");

    doc
      .fillColor("white")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("MINISTRY OF ENVIRONMENT, FOREST AND CLIMATE CHANGE", 60, 52, {
        align: "center",
        width: doc.page.width - 120,
      });

    doc
      .fontSize(11)
      .font("Helvetica")
      .text("General Information Summary Table (GIST)", 60, 74, {
        align: "center",
        width: doc.page.width - 120,
      });

    doc.fillColor("black").moveDown(2);

    // ── Project title banner ──────────────────────────────────────────
    const titleY = 125;
    doc
      .rect(50, titleY, doc.page.width - 100, 36)
      .fillAndStroke("#f0f9f0", "#c8e6c9");

    doc
      .fillColor("#1a5c38")
      .fontSize(13)
      .font("Helvetica-Bold")
      .text(projectName, 60, titleY + 10, {
        width: doc.page.width - 120,
        align: "center",
      });

    doc.fillColor("black").y = titleY + 50;

    // ── Metadata row ─────────────────────────────────────────────────
    const metaY = doc.y;
    const metaCols = [
      ["Recommendation", recommendation],
      ["Status", gist.status],
      ["Generated", generatedAt],
    ];

    const colW = (doc.page.width - 100) / metaCols.length;
    metaCols.forEach(([label, value], i) => {
      const x = 50 + i * colW;
      doc
        .rect(x, metaY, colW, 40)
        .fillAndStroke(i % 2 === 0 ? "#f8f8f8" : "#ffffff", "#e0e0e0");
      doc
        .fillColor("#666666")
        .fontSize(8)
        .font("Helvetica")
        .text(label.toUpperCase(), x + 6, metaY + 6, { width: colW - 12 });
      doc
        .fillColor("#1a1a1a")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text(value, x + 6, metaY + 18, { width: colW - 12 });
    });

    doc.fillColor("black");
    doc.y = metaY + 56;

    // ── Divider ───────────────────────────────────────────────────────
    doc
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke("#cccccc");
    doc.moveDown(0.8);

    // ── GIST body ─────────────────────────────────────────────────────
    const lines = summaryText.split("\n");

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();

      // Section headers (e.g. "1. Project Overview")
      if (/^\d+\.\s+\S/.test(line)) {
        doc.moveDown(0.4);
        doc
          .rect(50, doc.y, doc.page.width - 100, 20)
          .fillAndStroke("#e8f5e9", "#c8e6c9");
        doc
          .fillColor("#1a5c38")
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(line, 56, doc.y + 4, { width: doc.page.width - 116 });
        doc.fillColor("black");
        doc.moveDown(0.6);
        continue;
      }

      // Markdown table rows
      if (line.startsWith("|") && line.endsWith("|")) {
        const cells = line
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());

        // skip separator rows (---|---)
        if (cells.every((c) => /^[-: ]+$/.test(c))) continue;

        const isHeader = cells.some((c) => /^[A-Z]/.test(c)) && !cells[0].match(/^\d/);
        const cellW = (doc.page.width - 100) / cells.length;
        const rowY = doc.y;
        const rowH = 18;

        cells.forEach((cell, ci) => {
          doc
            .rect(50 + ci * cellW, rowY, cellW, rowH)
            .fillAndStroke(isHeader ? "#e8f5e9" : ci % 2 === 0 ? "#fafafa" : "#ffffff", "#e0e0e0");
          doc
            .fillColor(isHeader ? "#1a5c38" : "#333333")
            .fontSize(9)
            .font(isHeader ? "Helvetica-Bold" : "Helvetica")
            .text(cell, 54 + ci * cellW, rowY + 4, { width: cellW - 8, lineBreak: false });
        });

        doc.fillColor("black");
        doc.y = rowY + rowH;
        continue;
      }

      // Bullet points
      if (line.startsWith("- ") || line.startsWith("* ")) {
        doc
          .fillColor("#333333")
          .fontSize(10)
          .font("Helvetica")
          .text(`• ${line.slice(2)}`, 60, doc.y, {
            width: doc.page.width - 120,
          });
        continue;
      }

      // Empty line → small gap
      if (line.trim() === "") {
        doc.moveDown(0.3);
        continue;
      }

      // Default body text
      doc
        .fillColor("#333333")
        .fontSize(10)
        .font("Helvetica")
        .text(line, 50, doc.y, { width: doc.page.width - 100 });
    }

    // ── Footer ────────────────────────────────────────────────────────
    const footerY = doc.page.height - 50;
    doc
      .moveTo(50, footerY)
      .lineTo(doc.page.width - 50, footerY)
      .stroke("#cccccc");
    doc
      .fillColor("#888888")
      .fontSize(8)
      .font("Helvetica")
      .text(
        `Prepared by Parivesh Environmental Clearance System  •  Generated on ${generatedAt}`,
        50,
        footerY + 6,
        { align: "center", width: doc.page.width - 100 }
      );

    doc.end();
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to generate GIST PDF",
        error: error.message,
      });
    }
  }
};