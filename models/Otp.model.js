import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// static helper to create and save an otp (hashes internally)
otpSchema.statics.createForUser = async function (
  userId,
  otp,
  ttlSeconds = 300
) {
  const salt = await bcrypt.genSalt(10);
  const otpHash = await bcrypt.hash(otp, salt);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000); // expire in ttlSeconds or 5 minutes by default
  return this.create({ user: userId, otpHash, expiresAt });
};

// instance method to compare provided otp with stored hash
otpSchema.methods.compareOtp = function (plainOtp) {
  return bcrypt.compare(plainOtp, this.otpHash);
};

export default mongoose.model("Otp", otpSchema);
