// Run once to create the default admin login: `node seedAdmin.js`
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123"; // change this after first login

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ username: ADMIN_USERNAME });
  if (existing) {
    console.log("Admin already exists, skipping.");
    return process.exit(0);
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await Admin.create({ username: ADMIN_USERNAME, password: hashed });

  console.log(`Admin created -> username: ${ADMIN_USERNAME}, password: ${ADMIN_PASSWORD}`);
  process.exit(0);
}

seed();
