require("dotenv").config();
const mongoose = require("mongoose");
const Document = require("./src/models/Document");
const path = require("path");
const fs = require("fs");

async function checkDocs() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pariveshh");
  const docs = await Document.find({});
  for (let doc of docs) {
    console.log(`Doc: ${doc.documentName}`);
    console.log(`Original Path: ${doc.filePath}`);
    const resolvedPath = path.resolve(doc.filePath);
    console.log(`Resolved Path: ${resolvedPath}`);
    console.log(`Exists: ${fs.existsSync(resolvedPath)}`);
    console.log('---');
  }
  process.exit();
}

checkDocs();
