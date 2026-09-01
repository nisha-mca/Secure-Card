import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // stored as bcrypt hash
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    cardNumber: { type: String, required: true, unique: true }, // Single Transaction Card
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("User", userSchema);
