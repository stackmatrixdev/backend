import mongoose from "mongoose";

const aiChatSchema = new mongoose.Schema(
  {
    // User who initiated the chat
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Chat session ID
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    // Title of the conversation
    title: {
      type: String,
      default: "New Conversation",
      maxlength: 200,
    },

    // Context (which program/quiz the chat is related to)
    context: {
      type: {
        type: String,
        enum: ["general", "program", "quiz", "question"],
        default: "general",
      },
      program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program",
      },
      quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    },

    // Conversation messages
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant", "system"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        // AI model response metadata
        metadata: {
          model: String,
          tokens: Number,
          confidence: Number,
        },
      },
    ],

    // Chat statistics
    stats: {
      messageCount: { type: Number, default: 0 },
      userMessages: { type: Number, default: 0 },
      aiMessages: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 },
    },

    // Chat status
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },

    // Last activity
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },

    // Tags for organization
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // User rating/feedback
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      helpful: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

// Update stats when new message is added
aiChatSchema.methods.addMessage = function (role, content, metadata = {}) {
  this.messages.push({ role, content, metadata });
  this.stats.messageCount++;

  if (role === "user") {
    this.stats.userMessages++;
  } else if (role === "assistant") {
    this.stats.aiMessages++;
  }

  if (metadata.tokens) {
    this.stats.totalTokens += metadata.tokens;
  }

  this.lastActivityAt = new Date();
};

// Index for efficient queries
aiChatSchema.index({ user: 1, createdAt: -1 });
aiChatSchema.index({ sessionId: 1 });

const AIChat = mongoose.model("AIChat", aiChatSchema);

export default AIChat;
