// src/constants/sector.js

const SECTORS = {
  IT: "IT",
  MANUFACTURING: "MANUFACTURING",
  HEALTHCARE: "HEALTHCARE",
  EDUCATION: "EDUCATION",
  AGRICULTURE: "AGRICULTURE",
  INFRASTRUCTURE: "INFRASTRUCTURE",
  ENERGY: "ENERGY",
  TRANSPORT: "TRANSPORT",
  OTHER: "OTHER"
};

const isValidSector = (sector) => {
  return Object.values(SECTORS).includes(sector);
};

module.exports = {
  SECTORS,
  isValidSector
};