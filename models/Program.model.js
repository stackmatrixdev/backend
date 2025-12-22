import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Program name is required"],
      trim: true,
      unique: true,
    },
    topic: {
      type: String,
      required: [true, "Program topic is required"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: true,
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
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    // Visual content
    thumbnail: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },

    // Program content
    overview: {
      type: String,
      maxlength: 2000,
    },
    learningObjectives: [
      {
        type: String,
      },
    ],
    prerequisites: [
      {
        type: String,
      },
    ],

    // Associated quizzes
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],

    // Exam Simulator Configuration
    examSimulator: {
      enabled: {
        type: Boolean,
        default: false,
      },
      timeLimit: {
        type: Number,
        default: 30, // minutes
      },
      totalMarks: {
        type: Number,
        default: 100,
      },
      maxAttempts: {
        type: Number,
        default: 3,
      },
      passingScore: {
        type: Number,
        default: 70,
      },
      shuffleQuestions: {
        type: Boolean,
        default: true,
      },
      shuffleOptions: {
        type: Boolean,
        default: true,
      },
      showResults: {
        type: Boolean,
        default: true,
      },
      showExplanations: {
        type: Boolean,
        default: true,
      },
      questions: [
        {
          questionText: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            enum: ["single", "multiple", "true-false", "short-answer"],
            default: "single",
          },
          options: [
            {
              text: String,
              isCorrect: Boolean,
            },
          ],
          correctAnswers: [String], // For multiple choice
          explanation: String,
          mark: {
            type: Number,
            default: 1,
          },
          skillLevel: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium",
          },
        },
      ],
    },

    // Documentation/Resources
    documentation: [
      {
        title: String,
        content: String,
        fileUrl: String,
        type: {
          type: String,
          enum: ["pdf", "doc", "video", "link", "text"],
        },
      },
    ],

    // Statistics
    stats: {
      enrolledUsers: { type: Number, default: 0 },
      completedUsers: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
    },

    // Certificate settings
    certificateEnabled: {
      type: Boolean,
      default: true,
    },
    certificateTemplate: {
      type: String,
      default: null,
    },
    passingCriteria: {
      minimumScore: {
        type: Number,
        default: 70,
        min: 0,
        max: 100,
      },
      requiredQuizzes: {
        type: Number,
        default: 1,
      },
    },

    // Instructor
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
    },

    // Pricing (if premium)
    pricing: {
      isFree: {
        type: Boolean,
        default: true,
      },
      price: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "CAD",
      },
    },

    // Status
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Featured program
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Estimated time to complete (in hours)
    estimatedDuration: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
programSchema.index({ name: "text", topic: "text", description: "text" });

const Program = mongoose.model("Program", programSchema);

export default Program;
