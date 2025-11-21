import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },

    // User statistics
    stats: {
      quizzesCompleted: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      aiInteractions: { type: Number, default: 0 },
      studyHours: { type: Number, default: 0 },
    },

    // Learning goals
    goals: {
      weeklyStudyGoal: { type: Number, default: 15 }, // hours
      monthlyQuizGoal: { type: Number, default: 10 }, // quizzes
    },

    // Progress tracking
    enrolledPrograms: [
      {
        program: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Program",
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        status: {
          type: String,
          enum: ["not-started", "in-progress", "completed"],
          default: "not-started",
        },
      },
    ],

    // Subscription details
    subscription: {
      plan: {
        type: String,
        enum: ["free", "exam-only", "ai-only", "full-access"],
        default: "free",
      },
      startDate: Date,
      endDate: Date,
      isActive: {
        type: Boolean,
        default: false,
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
    },

    // Account settings
    preferences: {
      language: {
        type: String,
        default: "en",
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
    },

    // Password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Email verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update average score
userSchema.methods.updateAverageScore = function () {
  if (this.stats.quizzesCompleted > 0) {
    this.stats.averageScore = Math.round(
      this.stats.totalScore / this.stats.quizzesCompleted
    );
  }
};

const User = mongoose.model("User", userSchema);

export default User;
