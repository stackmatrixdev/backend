import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Topic title is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Development",
        "Business",
        "Marketing",
        "Lifestyle",
        "Music",
        "Design",
        "Academics",
        "Health & Fitness",
        "Productivity",
        "Accounting",
      ],
    },
    numberOfFreeQuestions: {
      type: Number,
      required: [true, "Number of free questions is required"],
      min: [0, "Cannot be negative"],
      default: 3,
    },
    pricing: {
      chatbotPrice: {
        type: Number,
        required: [true, "Chatbot price is required"],
        min: [0, "Price cannot be negative"],
        default: 0,
      },
      documentationPrice: {
        type: Number,
        required: [true, "Documentation price is required"],
        min: [0, "Price cannot be negative"],
        default: 0,
      },
      examSimulatorPrice: {
        type: Number,
        required: [true, "Exam simulator price is required"],
        min: [0, "Price cannot be negative"],
        default: 0,
      },
      bundlePrice: {
        type: Number,
        required: [true, "Bundle price is required"],
        min: [0, "Price cannot be negative"],
        default: 0,
      },
      currency: {
        type: String,
        default: "CAD",
      },
    },
    overview: {
      type: String, // HTML/Markdown content
      required: [true, "Overview is required"],
      maxlength: [10000, "Overview cannot exceed 10000 characters"],
    },
    coverImage: {
      type: String, // URL to uploaded image
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Statistics
    stats: {
      enrolledUsers: { type: Number, default: 0 },
      totalPrograms: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
topicSchema.index({ title: "text", description: "text" });

const Topic = mongoose.model("Topic", topicSchema);
export default Topic;
