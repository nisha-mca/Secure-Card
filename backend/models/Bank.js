import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    branch: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    accountType: { type: String, required: true },
    status: { type: String, default: "ACTIVE" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("Bank", bankSchema);
