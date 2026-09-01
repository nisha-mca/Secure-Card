import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import bankRoutes from "./routes/bank.js";
import transactionRoutes from "./routes/transaction.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

if (!process.env.AES_SECRET_KEY || process.env.AES_SECRET_KEY.length !== 64) {
  console.error(
    "FATAL: AES_SECRET_KEY in .env must be exactly 64 hex characters (32 bytes).\n" +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
  );
  process.exit(1);
}

const app = express();

// In production, set FRONTEND_URL to your deployed frontend's origin
// (e.g. https://securecard.vercel.app). Locally this falls back to allowing all origins.
const allowedOrigin = process.env.FRONTEND_URL || "*";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/banks", bankRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Secure Card API is running");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
