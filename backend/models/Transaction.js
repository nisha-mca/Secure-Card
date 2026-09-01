import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cardNumber: { type: String, required: true },
    bank: { type: mongoose.Schema.Types.ObjectId, ref: "Bank", required: true },
    bankName: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionType: { type: String, default: "USER_SELECTED_BANK" },
    encDescription: { type: String, required: true }, // AES-256-GCM ciphertext, never stored in plaintext
    keywordHashes: { type: [String], index: true }, // HMAC hashes enabling private keyword search
    transactionStatus: { type: String, default: "SUCCESS" },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("Transaction", transactionSchema);
