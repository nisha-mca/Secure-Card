import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { requireAdmin } from "../middleware/auth.js";
import { decrypt } from "../utils/crypto.js";

const router = express.Router();

// Admin dashboard: list of users + all transactions (description shown decrypted
// only here, behind admin auth, matching the audit-trail requirement in the report)
router.get("/dashboard", requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("fullName email mobile created_at");

    const txns = await Transaction.find()
      .populate("user", "fullName")
      .sort({ created_at: -1 });

    const formattedTxns = txns.map((t) => ({
      user: t.user?.fullName || "Unknown",
      bank: t.bankName,
      amount: t.amount,
      status: t.transactionStatus,
      description: decrypt(t.encDescription),
      date: t.created_at,
    }));

    res.json({ users, transactions: formattedTxns });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
