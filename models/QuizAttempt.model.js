import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    // User who attempted the quiz
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Quiz attempted
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    // Program
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },

    // Answers submitted
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedOptions: [
          {
            type: Number, // Index of selected option(s)
          },
        ],
        textAnswer: String, // For short answer questions
        isCorrect: {
          type: Boolean,
          default: false,
        },
        marksObtained: {
          type: Number,
          default: 0,
        },
        timeTaken: Number, // seconds spent on this question
      },
    ],

    // Scoring
    score: {
      obtained: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
      percentage: {
        type: Number,
        default: 0,
      },
    },

    // Timing
    duration: {
      allocated: Number, // minutes allocated
      taken: Number, // actual minutes taken
    },

    // Attempt status
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned", "expired"],
      default: "in-progress",
    },

    // Pass/Fail
    isPassed: {
      type: Boolean,
      default: false,
    },

    // Attempt number
    attemptNumber: {
      type: Number,
      default: 1,
    },

    // Start and end times
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },

    // Review requested
    reviewRequested: {
      type: Boolean,
      default: false,
    },

    // AI help used
    aiHelpUsed: {
      type: Boolean,
      default: false,
    },
    aiInteractions: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        helpText: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Performance metrics
    metrics: {
      correctAnswers: { type: Number, default: 0 },
      incorrectAnswers: { type: Number, default: 0 },
      skippedQuestions: { type: Number, default: 0 },
      averageTimePerQuestion: Number, // in seconds
    },
  },
  {
    timestamps: true,
  }
);

// Calculate percentage before saving
quizAttemptSchema.pre("save", function (next) {
  if (this.score.total > 0) {
    this.score.percentage = Math.round(
      (this.score.obtained / this.score.total) * 100
    );
  }
  next();
});

// Index for efficient queries
quizAttemptSchema.index({ user: 1, quiz: 1, createdAt: -1 });

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

export default QuizAttempt;
