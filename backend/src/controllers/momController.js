// src/controllers/momController.js

const PDFDocument = require("pdfkit");
const MoM = require("../models/MoM");
const Meeting = require("../models/Meeting");
const Application = require("../models/Application");
const Gist = require("../models/Gist");
const { buildMoMPrompt, generateMoMFromGemini } = require("../services/geminiGistService");

const MOM_DECISION_BY_RECOMMENDATION = {
  RECOMMENDED: "APPROVED",
  NOT_RECOMMENDED: "REJECTED",
  DEFERRED: "DEFERRED",
};

const resolveLocation = (application) => {
  const pieces = [application?.village, application?.district, application?.state]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  return pieces.length ? pieces.join(", ") : "Not Mentioned";
};

const findGistEntryForApplication = (gist, applicationId) => {
  if (!gist?.applications?.length) {
    return null;
  }

  return gist.applications.find((entry) => {
    const targetId = entry?.application?._id || entry?.application;
    return String(targetId) === String(applicationId);
  }) || gist.applications[0];
};

const deriveDecision = (recommendation) => {
  return MOM_DECISION_BY_RECOMMENDATION[String(recommendation || "").toUpperCase()] || "DEFERRED";
};

const buildFallbackMoM = ({ application, gistSummary }) => {
  return [
    "MINUTE OF MEETING (MoM)",
    "",
    "1. Meeting Context",
    `The proposal \"${application.projectName || "Not Mentioned"}\" was placed before the committee for deliberation based on the submitted and reviewed records.`,
    "",
    "2. Project Particulars",
    `Project Name: ${application.projectName || "Not Mentioned"}`,
    `Category: ${application.category || "Not Mentioned"}`,
    `Location: ${resolveLocation(application)}`,
    `Clearance Type: ${application.clearanceType || "Not Mentioned"}`,
    "",
    "3. Summary of Deliberations",
    gistSummary || "Not Mentioned",
    "",
    "4. Environmental and Compliance Observations",
    "The committee noted the available project details and emphasized compliance with applicable environmental safeguards and statutory conditions.",
    "",
    "5. Committee Decision",
    "The matter is recorded for committee decision in accordance with the deliberations above.",
    "",
    "6. Conditions / Safeguards",
    "Project Proponent shall implement all applicable environmental safeguards and submit required compliance reports to the competent authority.",
    "",
    "7. Follow-up Actions",
    "The competent authority shall communicate the final decision and applicable conditions to the applicant.",
  ].join("\n");
};

const createMoMPdfBuffer = async ({ application, mom }) => {
  const title = "MINUTE OF MEETING";
  const projectName = application?.projectName || "Unknown Project";
  const generatedAt = new Date(mom?.publishedAt || mom?.updatedAt || Date.now()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 52, left: 45, right: 45 },
  });

  const chunks = [];
  const pdfBufferPromise = new Promise((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("MINISTRY OF ENVIRONMENT, FOREST AND CLIMATE CHANGE", { align: "center" })
    .moveDown(0.3)
    .fontSize(13)
    .text(title, { align: "center" })
    .moveDown(0.8)
    .font("Helvetica")
    .fontSize(10)
    .text(`Project: ${projectName}`)
    .text(`Published on: ${generatedAt}`)
    .text(`Status: ${mom.status || "DRAFT"}`)
    .moveDown(1);

  const content = String(mom?.content || "No MoM content available.").replace(/\r/g, "");
  const lines = content.split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      doc.moveDown(0.4);
      continue;
    }

    const isHeading = /^\d+\./.test(line) || /^MINUTE OF MEETING/i.test(line);

    doc
      .font(isHeading ? "Helvetica-Bold" : "Helvetica")
      .fontSize(isHeading ? 11 : 10)
      .text(line, {
        align: "left",
        lineGap: 2,
      });
  }

  doc.end();
  return pdfBufferPromise;
};

const getApplicationWithDocs = async (applicationId) => {
  return Application.findById(applicationId)
    .populate("gistId")
    .populate("momId")
    .populate("meetingId")
    .populate("applicant", "name email organization");
};

const persistDraftMoM = async ({ application, gist, reqUserId, content, model }) => {
  const gistEntry = findGistEntryForApplication(gist, application._id);
  const decision = deriveDecision(gistEntry?.recommendation);

  const momPayload = {
    meeting: application.meetingId?._id || gist?.meeting,
    preparedBy: reqUserId,
    content,
    applications: [
      {
        application: application._id,
        decision,
        remarks: "Generated from edited GIST",
      },
    ],
    remarks: model
      ? `MoM draft converted from edited GIST using ${model}`
      : "MoM draft converted from edited GIST",
    status: "DRAFT",
  };

  let mom;
  if (application.momId?._id) {
    mom = await MoM.findByIdAndUpdate(application.momId._id, momPayload, {
      new: true,
      runValidators: true,
    });
  } else {
    mom = await MoM.create(momPayload);
    application.momId = mom._id;
    await application.save();
  }

  return mom;
};

// Generate MoM (legacy route)
exports.generateMoM = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId).populate("applications");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    const mom = await MoM.create({
      meeting: meeting._id,
      preparedBy: req.user._id,
      applications: meeting.applications.map((app) => ({
        application: app._id,
        decision: "DEFERRED",
        remarks: `Discussion held for ${app.projectName}`,
      })),
      status: "DRAFT",
      content: "MINUTE OF MEETING (MoM)\n\nDraft MoM generated. Please refine before publication.",
    });

    res.status(201).json({
      success: true,
      mom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "MoM generation failed",
      error: error.message,
    });
  }
};

// Get MoM by meeting
exports.getMoMByMeeting = async (req, res) => {
  try {
    const mom = await MoM.findOne({ meeting: req.params.meetingId })
      .populate("meeting")
      .populate("applications.application");

    res.status(200).json({
      success: true,
      mom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch MoM",
      error: error.message,
    });
  }
};

// Get MoM by ID
exports.getMoMById = async (req, res) => {
  try {
    const mom = await MoM.findById(req.params.id)
      .populate("meeting")
      .populate("applications.application")
      .populate("preparedBy", "name email")
      .populate("approvedBy", "name email");

    if (!mom) {
      return res.status(404).json({
        success: false,
        message: "MoM not found",
      });
    }

    res.status(200).json({
      success: true,
      mom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching MoM",
      error: error.message,
    });
  }
};

// Finalize MoM (legacy route by MoM id)
exports.finalizeMoM = async (req, res) => {
  try {
    const mom = await MoM.findById(req.params.id);

    if (!mom) {
      return res.status(404).json({
        success: false,
        message: "MoM not found",
      });
    }

    const appEntry = mom.applications?.[0];
    const applicationId = appEntry?.application;

    if (applicationId) {
      const application = await Application.findById(applicationId);
      if (application) {
        application.status = "APPROVED";
        application.isLocked = true;
        application.lockedAt = new Date();
        application.momId = mom._id;
        application.history.push({
          status: "APPROVED",
          updatedBy: req.user._id,
          remarks: "Application approved after final MoM publication",
        });
        await application.save();
      }
    }

    mom.status = "PUBLISHED";
    mom.approvedBy = req.user._id;
    mom.publishedAt = new Date();
    await mom.save();

    res.status(200).json({
      success: true,
      mom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to finalize MoM",
      error: error.message,
    });
  }
};

exports.getMoMTeamDashboard = async (req, res) => {
  try {
    const applications = await Application.find({
      status: { $in: ["REFERRED_TO_MEETING", "IN_MEETING", "APPROVED"] },
    })
      .populate("gistId")
      .populate("momId")
      .populate("meetingId")
      .populate("applicant", "name organization")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch MoM team dashboard",
      error: error.message,
    });
  }
};

exports.getMoMTeamApplicationRecord = async (req, res) => {
  try {
    const application = await getApplicationWithDocs(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      application,
      gist: application.gistId || null,
      mom: application.momId || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch MoM team application record",
      error: error.message,
    });
  }
};

exports.editApplicationGist = async (req, res) => {
  try {
    const { summary, recommendation } = req.body;
    const application = await getApplicationWithDocs(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.isLocked) {
      return res.status(423).json({
        success: false,
        message: "Application is locked after final MoM publication",
      });
    }

    if (!summary || !String(summary).trim()) {
      return res.status(400).json({
        success: false,
        message: "Edited gist summary is required",
      });
    }

    let gist = application.gistId;

    if (!gist) {
      gist = await Gist.create({
        meeting: application.meetingId?._id,
        preparedBy: req.user._id,
        applications: [
          {
            application: application._id,
            summary: String(summary).trim(),
            recommendation: recommendation || "DEFERRED",
          },
        ],
        status: "DRAFT",
        remarks: "Created and edited by MoM Team",
      });
      application.gistId = gist._id;
      await application.save();
    } else {
      if (gist.status === "FINALIZED") {
        return res.status(409).json({
          success: false,
          message: "Gist is finalized and cannot be edited",
        });
      }

      const appEntry = findGistEntryForApplication(gist, application._id);

      if (appEntry) {
        appEntry.summary = String(summary).trim();
        if (recommendation) {
          appEntry.recommendation = recommendation;
        }
      } else {
        gist.applications.push({
          application: application._id,
          summary: String(summary).trim(),
          recommendation: recommendation || "DEFERRED",
        });
      }

      gist.preparedBy = req.user._id;
      gist.status = "DRAFT";
      gist.remarks = "Edited by MoM Team";
      await gist.save();
    }

    const refreshed = await getApplicationWithDocs(application._id);

    res.status(200).json({
      success: true,
      gist: refreshed.gistId,
      application: refreshed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to edit gist",
      error: error.message,
    });
  }
};

exports.convertGistToMoMForApplication = async (req, res) => {
  try {
    const application = await getApplicationWithDocs(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.isLocked) {
      return res.status(423).json({
        success: false,
        message: "Application is locked after final MoM publication",
      });
    }

    const gist = application.gistId;

    if (!gist) {
      return res.status(400).json({
        success: false,
        message: "Edited gist is required before conversion",
      });
    }

    const gistEntry = findGistEntryForApplication(gist, application._id);
    const gistSummary = String(gistEntry?.summary || "").trim();

    if (!gistSummary) {
      return res.status(400).json({
        success: false,
        message: "Edited gist summary is required before conversion",
      });
    }

    const prompt = buildMoMPrompt({
      projectTitle: application.projectName,
      category: application.category,
      location: resolveLocation(application),
      gistText: gistSummary,
    });

    let momContent;
    let model;

    try {
      const conversion = await generateMoMFromGemini(prompt);
      momContent = conversion.momText;
      model = conversion.model;
    } catch (error) {
      momContent = buildFallbackMoM({ application, gistSummary });
      model = `fallback:${error.message}`;
    }

    const mom = await persistDraftMoM({
      application,
      gist,
      reqUserId: req.user._id,
      content: momContent,
      model,
    });

    const refreshedApplication = await getApplicationWithDocs(application._id);

    res.status(200).json({
      success: true,
      mom,
      application: refreshedApplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to convert gist to MoM",
      error: error.message,
    });
  }
};

exports.publishMoMForApplication = async (req, res) => {
  try {
    const application = await getApplicationWithDocs(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.isLocked) {
      return res.status(423).json({
        success: false,
        message: "Application is already locked",
      });
    }

    const mom = application.momId;

    if (!mom) {
      return res.status(400).json({
        success: false,
        message: "MoM draft is required before publication",
      });
    }

    if (!String(mom.content || "").trim()) {
      return res.status(400).json({
        success: false,
        message: "MoM content is empty and cannot be published",
      });
    }

    mom.status = "PUBLISHED";
    mom.approvedBy = req.user._id;
    mom.publishedAt = new Date();

    if (Array.isArray(mom.applications) && mom.applications.length) {
      mom.applications[0].decision = "APPROVED";
      mom.applications[0].remarks = "Final MoM published by MoM Team";
    }

    await mom.save();

    if (application.gistId && application.gistId.status !== "FINALIZED") {
      application.gistId.status = "FINALIZED";
      await application.gistId.save();
    }

    application.status = "APPROVED";
    application.isLocked = true;
    application.lockedAt = new Date();
    application.momId = mom._id;
    application.history.push({
      status: "APPROVED",
      updatedBy: req.user._id,
      remarks: "Application approved and locked after final MoM publication",
    });

    await application.save();

    const refreshed = await getApplicationWithDocs(application._id);

    res.status(200).json({
      success: true,
      mom,
      application: refreshed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to publish MoM",
      error: error.message,
    });
  }
};

exports.downloadMoMPdf = async (req, res) => {
  try {
    const mom = await MoM.findById(req.params.id)
      .populate("applications.application", "projectName")
      .populate("approvedBy", "name email");

    if (!mom) {
      return res.status(404).json({
        success: false,
        message: "MoM not found",
      });
    }

    const application = mom.applications?.[0]?.application;
    const pdfBuffer = await createMoMPdfBuffer({
      application,
      mom,
    });

    const safeFileName = String(application?.projectName || "MoM")
      .replace(/[^a-z0-9_\-\s]/gi, "_")
      .replace(/\s+/g, "_");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="MoM_${safeFileName}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    if (res.headersSent) {
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to generate MoM PDF",
      error: error.message,
    });
  }
};
