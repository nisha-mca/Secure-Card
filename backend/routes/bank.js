import express from "express";
import Bank from "../models/Bank.js";
import { requireUser } from "../middleware/auth.js";

const router = express.Router();

// GET all banks linked to the logged-in user
router.get("/", requireUser, async (req, res) => {
  const banks = await Bank.find({ user: req.user.id }).sort({ created_at: -1 });
  res.json(banks);
});

// ADD a new bank account (link a new bank to the Single Transaction Card)
router.post("/", requireUser, async (req, res) => {
  try {
    const { bank, account, ifsc, branch, balance, type } = req.body;
    if (!bank || !account || !ifsc || !branch || balance === undefined || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBank = await Bank.create({
      user: req.user.id,
      bankName: bank,
      accountNumber: account,
      ifscCode: ifsc,
      branch,
      balance: Number(balance),
      accountType: type,
    });

    res.status(201).json(newBank);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
