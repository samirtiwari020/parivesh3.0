// src/constants/applicationStatus.js

const APPLICATION_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  EDS_RAISED: "EDS_RAISED",
  RESUBMITTED: "RESUBMITTED",
  UNDER_SCRUTINY: "UNDER_SCRUTINY",
  REFERRED_TO_MEETING: "REFERRED_TO_MEETING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  DEFERRED: "DEFERRED",
  CLOSED: "CLOSED"
};

const STATUS_FLOW = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["EDS_RAISED", "UNDER_SCRUTINY"],
  EDS_RAISED: ["RESUBMITTED"],
  RESUBMITTED: ["UNDER_SCRUTINY"],
  UNDER_SCRUTINY: ["REFERRED_TO_MEETING"],
  REFERRED_TO_MEETING: ["APPROVED", "REJECTED", "DEFERRED"],
  DEFERRED: ["REFERRED_TO_MEETING"]
};

const isValidStatusTransition = (currentStatus, newStatus) => {
  const allowed = STATUS_FLOW[currentStatus] || [];
  return allowed.includes(newStatus);
};

const isFinalStatus = (status) => {
  return ["APPROVED", "REJECTED", "CLOSED"].includes(status);
};

module.exports = {
  APPLICATION_STATUS,
  STATUS_FLOW,
  isValidStatusTransition,
  isFinalStatus
};