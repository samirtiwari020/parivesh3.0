// src/constants/roles.js

const ROLES = {
  ADMIN: "ADMIN",
  OFFICER: "OFFICER",
  SCRUTINY_OFFICER: "SCRUTINY_OFFICER",
  COMMITTEE_MEMBER: "COMMITTEE_MEMBER",
  APPLICANT: "APPLICANT"
};

const isAdmin = (role) => {
  return role === ROLES.ADMIN;
};

const isOfficer = (role) => {
  return role === ROLES.OFFICER;
};

const isScrutinyOfficer = (role) => {
  return role === ROLES.SCRUTINY_OFFICER;
};

module.exports = {
  ROLES,
  isAdmin,
  isOfficer,
  isScrutinyOfficer
};