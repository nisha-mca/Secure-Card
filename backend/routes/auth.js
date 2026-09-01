import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

const router = express.Router();

function signToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "8h" });
}

// ---------------- USER REGISTER ----------------
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, mobile, username, password } = req.body;
    if (!fullname || !email || !mobile || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const cardNumber = "CARD" + mobile;

    const user = await User.create({
      username,
      password: hashedPassword,
      fullName: fullname,
      email,
      mobile,
      cardNumber,
    });

    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, username: user.username, cardNumber: user.cardNumber },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- USER LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id, "user");
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        cardNumber: user.cardNumber,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- ADMIN LOGIN ----------------
router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(admin._id, "admin");
    res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
