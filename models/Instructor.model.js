import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    // Personal Information
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    // User reference (if they have a user account)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Professional Details
    areaOfExpertise: {
      type: String,
      required: [true, "Area of expertise is required"],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      maxlength: 1000,
    },

    // Portfolio
    portfolio: {
      fileUrl: String,
      fileName: String,
      uploadedAt: Date,
    },

    // Additional information
    experience: {
      type: Number, // years of experience
      default: 0,
    },
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    certifications: [
      {
        name: String,
        issuedBy: String,
        issuedDate: Date,
        certificateUrl: String,
      },
    ],

    // Social links
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String,
      github: String,
    },

    // Profile
    avatar: {
      type: String,
      default: null,
    },

    // Programs created
    programs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
    ],

    // Statistics
    stats: {
      totalStudents: { type: Number, default: 0 },
      totalPrograms: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
    },

    // Verification status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },

    // Admin notes
    adminNotes: {
      type: String,
      maxlength: 500,
    },

    // Approval details
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,

    // Active status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Instructor = mongoose.model("Instructor", instructorSchema);

export default Instructor;
