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

// In production, set FRONTEND_URL to your deployed frontend's stable origin
// (e.g. https://securecard.vercel.app). Vercel preview URLs (which change on
// every deploy) are matched separately via the regex below.
const allowedOrigins = [
  process.env.FRONTEND_URL, // stable production URL from .env
  /^https:\/\/secure-card-.*-flower-shop1\.vercel\.app$/, // any Vercel preview deploy for this project
].filter(Boolean); // removes undefined if FRONTEND_URL isn't set

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) =>
        allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

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
