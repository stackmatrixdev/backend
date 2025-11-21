import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    // Certificate holder
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Program completed
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },

    // Certificate details
    certificateNumber: {
      type: String,
      unique: true,
      required: true,
    },

    // Certificate title
    title: {
      type: String,
      required: true,
    },

    // Issue date
    issuedAt: {
      type: Date,
      default: Date.now,
    },

    // Validity
    validUntil: {
      type: Date,
      default: null, // null means lifetime validity
    },

    // Performance data
    performance: {
      finalScore: {
        type: Number,
        required: true,
      },
      totalQuizzes: {
        type: Number,
        required: true,
      },
      completedQuizzes: {
        type: Number,
        required: true,
      },
      averageScore: {
        type: Number,
        required: true,
      },
    },

    // Certificate file
    certificateUrl: {
      type: String,
      default: null,
    },

    // Verification
    verificationCode: {
      type: String,
      unique: true,
      required: true,
    },

    // Certificate status
    status: {
      type: String,
      enum: ["active", "revoked", "expired"],
      default: "active",
    },

    // Metadata
    metadata: {
      completionDate: Date,
      totalHoursStudied: Number,
      skillLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
      },
    },

    // Issued by
    issuedBy: {
      type: String,
      default: "LearninGPT",
    },
  },
  {
    timestamps: true,
  }
);

// Generate certificate number before saving
certificateSchema.pre("save", async function (next) {
  if (!this.certificateNumber) {
    const count = await mongoose.model("Certificate").countDocuments();
    const year = new Date().getFullYear();
    this.certificateNumber = `LGPT-${year}-${String(count + 1).padStart(
      6,
      "0"
    )}`;
  }

  if (!this.verificationCode) {
    this.verificationCode = `${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`.toUpperCase();
  }

  next();
});

// Index for verification
certificateSchema.index({ verificationCode: 1 });
certificateSchema.index({ user: 1, program: 1 });

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
