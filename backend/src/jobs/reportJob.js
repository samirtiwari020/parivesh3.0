// src/jobs/reportJob.js

const Application = require("../models/Application");
const Payment = require("../models/Payment");
const Meeting = require("../models/Meeting");

/*
  This scheduled job can be used for:
  - Generating daily/weekly reports
  - Logging system statistics
  - Sending report summaries to admin
*/

const runReportJob = async () => {
  try {
    console.log("Running Report Job...");

    const totalApplications = await Application.countDocuments();
    const totalMeetings = await Meeting.countDocuments();
    const totalPayments = await Payment.countDocuments({ status: "SUCCESS" });

    const totalRevenueData = await Payment.aggregate([
      { $match: { status: "SUCCESS" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);

    const totalRevenue = totalRevenueData.length
      ? totalRevenueData[0].totalRevenue
      : 0;

    const report = {
      generatedAt: new Date(),
      totalApplications,
      totalMeetings,
      totalSuccessfulPayments: totalPayments,
      totalRevenue
    };

    console.log("Report Generated:");
    console.log(report);

    // Future extension:
    // - Save report to DB
    // - Send email to admin
    // - Export PDF/CSV

  } catch (error) {
    console.error("Report Job Failed:", error.message);
  }
};

module.exports = runReportJob;