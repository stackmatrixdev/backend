import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // User who submitted the review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Review target (can be program, quiz, or general platform)
    target: {
      type: {
        type: String,
        enum: ["program", "quiz", "platform"],
        required: true,
      },
      program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
      quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    },

    // Rating (1-5 stars)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Review text
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    // Quick feedback tags
    tags: [
      {
        type: String,
        enum: [
          "Loved the question format",
          "Challenging but helpful",
          "AI help was useful",
          "Great content",
          "Easy to understand",
          "Well structured",
          "Too difficult",
          "Too easy",
          "Technical issues",
          "Needs improvement",
        ],
      },
    ],

    // Context (related to quiz attempt)
    quizAttempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizAttempt",
    },

    // Review status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "flagged"],
      default: "approved", // Auto-approve by default, can be moderated
    },

    // Moderation
    moderation: {
      moderatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      moderatedAt: Date,
      reason: String,
    },

    // Helpful votes
    votes: {
      helpful: {
        type: Number,
        default: 0,
      },
      notHelpful: {
        type: Number,
        default: 0,
      },
      votedBy: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          vote: {
            type: String,
            enum: ["helpful", "notHelpful"],
          },
        },
      ],
    },

    // Admin response
    response: {
      text: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      respondedAt: Date,
    },

    // Is featured review
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per user per target
reviewSchema.index(
  { user: 1, "target.type": 1, "target.program": 1, "target.quiz": 1 },
  { unique: true }
);

// Update program/quiz average rating when review is saved
reviewSchema.post("save", async function () {
  const Review = mongoose.model("Review");
  const Program = mongoose.model("Program");
  const Quiz = mongoose.model("Quiz");

  if (this.target.type === "program" && this.target.program) {
    const reviews = await Review.find({
      "target.program": this.target.program,
      status: "approved",
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Program.findByIdAndUpdate(this.target.program, {
      "stats.averageRating": avgRating,
      "stats.totalReviews": reviews.length,
    });
  }

  if (this.target.type === "quiz" && this.target.quiz) {
    const reviews = await Review.find({
      "target.quiz": this.target.quiz,
      status: "approved",
    });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Quiz.findByIdAndUpdate(this.target.quiz, {
      "stats.avgRating": avgRating,
    });
  }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
