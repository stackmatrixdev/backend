import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },

    // Association with program
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },

    // Quiz type
    type: {
      type: String,
      enum: ["exam-simulator", "guided-questions", "practice"],
      default: "exam-simulator",
    },

    // Quiz settings
    settings: {
      duration: {
        type: Number, // in minutes
        required: true,
        default: 60,
      },
      totalMarks: {
        type: Number,
        required: true,
        default: 100,
      },
      passingMarks: {
        type: Number,
        required: true,
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
      allowRetake: {
        type: Boolean,
        default: true,
      },
      maxAttempts: {
        type: Number,
        default: 3,
      },
      showExplanations: {
        type: Boolean,
        default: true,
      },
    },

    // Questions
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    // Quiz metadata
    questionsCount: {
      type: Number,
      default: 0,
    },

    // Statistics
    stats: {
      attempts: { type: Number, default: 0 },
      avgScore: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
      lowestScore: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 },
    },

    // Difficulty
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    // Status
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },

    // Created by (admin/instructor)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Tags for categorization
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // AI features
    aiEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Update questionsCount when questions array changes
quizSchema.pre("save", function (next) {
  this.questionsCount = this.questions.length;
  next();
});

// Add pagination plugin
quizSchema.plugin(mongoosePaginate);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
