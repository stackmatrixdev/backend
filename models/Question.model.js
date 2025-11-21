import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    // Question text
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },

    // Question type
    type: {
      type: String,
      enum: ["single", "multiple", "true-false", "short-answer"],
      default: "single",
      required: true,
    },

    // Options for MCQ questions
    options: [
      {
        text: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // For short answer questions
    correctAnswer: {
      type: String,
      trim: true,
    },

    // Explanation
    explanation: {
      type: String,
      maxlength: 1000,
    },

    // Points/Marks
    marks: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Difficulty
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    // Association with quiz
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },

    // Media attachments
    media: {
      type: {
        type: String,
        enum: ["image", "video", "audio", "none"],
        default: "none",
      },
      url: String,
    },

    // Tags for categorization
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Topic/Subject area
    topic: {
      type: String,
      trim: true,
    },

    // Statistics
    stats: {
      timesAnswered: { type: Number, default: 0 },
      timesCorrect: { type: Number, default: 0 },
      difficultyRating: { type: Number, default: 0, min: 0, max: 5 },
    },

    // Created by
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Order in quiz
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Validation: Ensure at least one correct answer for MCQ
questionSchema.pre("save", function (next) {
  if (this.type === "single" || this.type === "multiple") {
    const hasCorrect = this.options.some((opt) => opt.isCorrect);
    if (!hasCorrect) {
      next(new Error("At least one option must be marked as correct"));
    }
  }
  next();
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
