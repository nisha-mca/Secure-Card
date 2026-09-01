import express from "express";
import Bank from "../models/Bank.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { requireUser } from "../middleware/auth.js";
import { encrypt, decrypt, hashKeyword, hashKeywords } from "../utils/crypto.js";

const router = express.Router();

// ---------------- MAKE TRANSACTION ----------------
// Encrypts the description with AES-256-GCM before it ever touches the database,
// and stores only HMAC keyword hashes so the record stays searchable without
// exposing plaintext (Data Encryption Module + Private Search Module).
router.post("/pay", requireUser, async (req, res) => {
  try {
    const { bank_id, amount, desc } = req.body;
    const amountNum = Number(amount);

    const bankAccount = await Bank.findOne({ _id: bank_id, user: req.user.id });
    if (!bankAccount) return res.status(404).json({ message: "Bank account not found" });
    if (bankAccount.balance < amountNum) {
      return res.status(400).json({ message: "Insufficient Balance" });
    }

    const user = await User.findById(req.user.id);

    bankAccount.balance -= amountNum;
    await bankAccount.save();

    const transaction = await Transaction.create({
      user: req.user.id,
      cardNumber: user.cardNumber,
      bank: bankAccount._id,
      bankName: bankAccount.bankName,
      amount: amountNum,
      transactionType: "USER_SELECTED_BANK",
      encDescription: encrypt(desc),
      keywordHashes: hashKeywords(desc),
      transactionStatus: "SUCCESS",
      ipAddress: req.ip,
    });

    res.status(201).json({ message: "Transaction successful", transaction });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- PRIVATE SEARCH ----------------
// The plaintext keyword never reaches storage or the query layer as cleartext -
// it is hashed client-side of the query (here, server-side right before the
// query) and matched purely against precomputed keyword_hash values.
router.post("/search", requireUser, async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) return res.status(400).json({ message: "Keyword is required" });

    const hash = hashKeyword(keyword);
    const rows = await Transaction.find({
      user: req.user.id,
      keywordHashes: hash,
    }).sort({ created_at: -1 });

    const results = rows.map((r) => ({
      bank: r.bankName,
      amount: r.amount,
      description: decrypt(r.encDescription),
      date: r.created_at,
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
