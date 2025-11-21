import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    // User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Plan details
    plan: {
      type: {
        type: String,
        enum: ["exam-only", "ai-only", "full-access"],
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "CAD",
      },
      billingCycle: {
        type: String,
        enum: ["monthly", "yearly"],
        default: "monthly",
      },
    },

    // Features included
    features: [
      {
        type: String,
      },
    ],

    // Subscription period
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },

    // Status
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "paused"],
      default: "active",
    },

    // Payment gateway details
    payment: {
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      stripePriceId: String,
      lastPaymentDate: Date,
      nextPaymentDate: Date,
      paymentMethod: {
        type: String,
        enum: ["stripe", "paypal", "card"],
        default: "stripe",
      },
    },

    // Auto-renewal
    autoRenew: {
      type: Boolean,
      default: true,
    },

    // Trial period
    trial: {
      isTrial: {
        type: Boolean,
        default: false,
      },
      trialEndsAt: Date,
    },

    // Cancellation
    cancellation: {
      isCancelled: {
        type: Boolean,
        default: false,
      },
      cancelledAt: Date,
      reason: String,
      cancelledBy: {
        type: String,
        enum: ["user", "admin", "system"],
      },
    },

    // Usage limits (for specific plans)
    limits: {
      aiChatsPerMonth: {
        type: Number,
        default: -1, // -1 means unlimited
      },
      quizzesPerMonth: {
        type: Number,
        default: -1,
      },
      currentAiChats: {
        type: Number,
        default: 0,
      },
      currentQuizzes: {
        type: Number,
        default: 0,
      },
      resetDate: Date,
    },

    // Discount/Coupon applied
    discount: {
      code: String,
      percentage: Number,
      amount: Number,
      appliedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Check if subscription is active
subscriptionSchema.methods.isActive = function () {
  return this.status === "active" && new Date() <= this.endDate;
};

// Reset usage limits monthly
subscriptionSchema.methods.resetLimits = function () {
  this.limits.currentAiChats = 0;
  this.limits.currentQuizzes = 0;
  this.limits.resetDate = new Date();
};

// Index for efficient queries
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
