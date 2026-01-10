import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    // Payment details
    paymentId: {
      type: String, // Stripe payment intent ID
      required: true,
    },
    sessionId: {
      type: String, // Stripe checkout session ID
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "CAD",
    },
    // Payment status
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    // Access type
    accessType: {
      type: String,
      enum: ["documentation", "ai_coach", "exam_simulator", "full_access"],
      required: true,
    },
    // Timestamps
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: null, // null = lifetime access (one-time payment)
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one purchase per user per program per access type
coursePurchaseSchema.index(
  { user: 1, program: 1, accessType: 1 },
  { unique: true }
);

// Static method to check if user has purchased a course
coursePurchaseSchema.statics.hasAccess = async function (
  userId,
  programId,
  accessType = "documentation"
) {
  const purchase = await this.findOne({
    user: userId,
    program: programId,
    accessType: { $in: [accessType, "full_access"] },
    status: "completed",
    $or: [
      { expiresAt: null }, // Lifetime access
      { expiresAt: { $gt: new Date() } }, // Not expired
    ],
  });
  return !!purchase;
};

// Static method to get all purchases for a user
coursePurchaseSchema.statics.getUserPurchases = async function (userId) {
  return this.find({
    user: userId,
    status: "completed",
  }).populate("program", "title thumbnail");
};

const CoursePurchase = mongoose.model("CoursePurchase", coursePurchaseSchema);

export default CoursePurchase;
