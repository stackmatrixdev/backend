import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Program name is required"],
      trim: true,
      // Removed unique constraint to allow multiple programs with similar names
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
      trim: true,
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
      maxlength: 5000, // Increased for detailed descriptions
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

    // Course Sections (for detailed course structure)
    courseSections: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        topics: [String], // List of topics covered in this section
        order: Number,
      },
    ],

    // Topics Covered (high-level bullet points)
    topicsCovered: [
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
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
          },
        },
      ],
    },

    // Guided Questions Configuration
    guidedQuestions: {
      enabled: {
        type: Boolean,
        default: false,
      },
      freeAttempts: {
        type: Number,
        default: 3,
      },
      questions: [
        {
          question: {
            type: String,
            required: true,
          },
          answer: {
            type: String,
            required: true,
          },
        },
      ],
    },

    // Documentation/Resources - Free and Premium sections
    documentation: {
      free: [
        {
          title: {
            type: String,
            required: true,
          },
          description: String,
          type: {
            type: String,
            enum: ["pdf", "video", "youtube", "google-slides", "link"],
            required: true,
          },
          fileUrl: String, // For uploaded files
          externalUrl: String, // For YouTube, Google Slides, etc.
          fileName: String,
          fileSize: Number,
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      premium: [
        {
          title: {
            type: String,
            required: true,
          },
          description: String,
          type: {
            type: String,
            enum: ["pdf", "video", "youtube", "google-slides", "link"],
            required: true,
          },
          fileUrl: String, // For uploaded files
          externalUrl: String, // For YouTube, Google Slides, etc.
          fileName: String,
          fileSize: Number,
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },

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

    // Created By (User who created the program)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional field, can be set later if needed
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
      // Individual access pricing
      documentationPrice: {
        type: Number,
        default: 19.99,
      },
      aiCoachPrice: {
        type: Number,
        default: 19.99,
      },
      examSimulatorPrice: {
        type: Number,
        default: 19.99,
      },
      fullAccessPrice: {
        type: Number,
        default: 29.99,
      },
    },

    // Status
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published", // Changed to published so new trainings appear immediately
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
