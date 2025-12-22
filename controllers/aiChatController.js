import AIChat from "../models/AIChat.model.js";
import User from "../models/User.model.js";
import Subscription from "../models/Subscription.model.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";
import { devLog } from "../utils/helper.js";
import axios from "axios";
import crypto from "crypto";
import mongoose from "mongoose";

// AI Service Configuration
const AI_API_BASE_URL =
  process.env.AI_API_BASE_URL || "http://localhost:8000/api/v1";
const AI_API_TIMEOUT = parseInt(process.env.AI_API_TIMEOUT) || 30000; // 30 seconds

class AIChatController {
  // Create new chat session
  static async createSession(req, res) {
    try {
      const userId = req.user.id;
      const { topic, program_id, context = "general" } = req.body;

      // Check user's chat limits
      const limitCheck = await AIChatController.checkChatLimits(userId);
      if (!limitCheck.canChat) {
        return res.status(403).json({
          success: false,
          message: "Free chat limit reached. Please upgrade your subscription.",
          data: {
            remainingChats: 0,
            subscriptionRequired: true,
            upgradeUrl: "/pricing",
          },
        });
      }

      // Generate unique session ID
      const sessionId = crypto.randomUUID();

      // Create new chat session
      const newChat = new AIChat({
        user: userId,
        sessionId,
        title: topic || "New Conversation",
        context: {
          type: context,
          program: program_id ? new mongoose.Types.ObjectId(program_id) : null,
        },
        messages: [],
        status: "active",
        metadata: {
          totalTokensUsed: 0,
          messageCount: 0,
        },
      });

      await newChat.save();

      devLog(`New AI chat session created: ${sessionId} for user: ${userId}`);

      return handleSuccess(
        res,
        201,
        {
          sessionId: sessionId,
          topic: topic || "New Conversation",
          remainingChats: limitCheck.remainingChats - 1,
          subscriptionRequired: false,
          context: context,
          program_id: program_id,
        },
        "Chat session created successfully"
      );
    } catch (error) {
      devLog(`Create session error: ${error.message}`);
      return handleError(res, 500, "Failed to create chat session", error);
    }
  }

  // Send message and get AI response
  static async sendMessage(req, res) {
    try {
      const userId = req.user.id;
      const {
        sessionId,
        message,
        skill_level = "beginner",
        program_id,
      } = req.body;

      // Validate required fields
      if (!sessionId || !message) {
        return handleError(res, 400, "Session ID and message are required");
      }

      // Check user's chat limits
      const limitCheck = await AIChatController.checkChatLimits(userId);
      if (!limitCheck.canChat) {
        return res.status(403).json({
          success: false,
          message: "Free chat limit reached. Please upgrade your subscription.",
          data: {
            remainingChats: 0,
            subscriptionRequired: true,
            upgradeUrl: "/pricing",
          },
        });
      }

      // Find chat session
      const chatSession = await AIChat.findOne({
        sessionId,
        user: userId,
        status: "active",
      });

      if (!chatSession) {
        return handleError(res, 404, "Chat session not found or inactive");
      }

      // Add user message to session
      const userMessage = {
        _id: new mongoose.Types.ObjectId(),
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      chatSession.messages.push(userMessage);

      try {
        // Call AI API
        const aiResponse = await axios.post(
          `${AI_API_BASE_URL}/chat/`,
          {
            message: message,
            program_id: program_id || chatSession.context?.program?.toString(),
            session_id: sessionId,
            skill_level: skill_level,
          },
          {
            timeout: AI_API_TIMEOUT,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const aiData = aiResponse.data;

        // Add AI response to session
        const aiMessage = {
          _id: new mongoose.Types.ObjectId(),
          role: "assistant",
          content: aiData.response,
          timestamp: new Date(),
          metadata: {
            sources: aiData.sources || [],
            follow_up_suggestions: aiData.follow_up_suggestions || [],
            tokens_used: aiData.metadata?.tokens_used || 0,
            response_time_ms: aiData.metadata?.response_time_ms || 0,
            model_used: aiData.metadata?.model_used || "unknown",
            skill_level: aiData.metadata?.skill_level || skill_level,
          },
        };

        chatSession.messages.push(aiMessage);

        // Update session metadata
        chatSession.metadata.totalTokensUsed +=
          aiData.metadata?.tokens_used || 0;
        chatSession.metadata.messageCount += 2; // user + ai message
        chatSession.lastActivity = new Date();

        await chatSession.save();

        // Update user's AI interaction count
        await AIChatController.updateUserAIStats(userId);

        devLog(
          `AI response generated for session: ${sessionId}, tokens: ${
            aiData.metadata?.tokens_used || 0
          }`
        );

        return handleSuccess(
          res,
          200,
          {
            messageId: aiMessage._id,
            aiResponse: aiData.response,
            sources: aiData.sources || [],
            follow_up_suggestions: aiData.follow_up_suggestions || [],
            metadata: aiData.metadata || {},
            remainingChats: limitCheck.remainingChats - 1,
            subscriptionRequired: false,
            timestamp: aiMessage.timestamp,
          },
          "Message sent and AI response received"
        );
      } catch (aiError) {
        devLog(`AI API Error: ${aiError.message}`);

        // Add error message to chat for tracking
        const errorMessage = {
          _id: new mongoose.Types.ObjectId(),
          role: "system",
          content: "AI service temporarily unavailable. Please try again.",
          timestamp: new Date(),
          metadata: {
            error: true,
            errorType: "ai_service_error",
          },
        };

        chatSession.messages.push(errorMessage);
        await chatSession.save();

        return handleError(
          res,
          503,
          "AI service is temporarily unavailable. Please try again later."
        );
      }
    } catch (error) {
      devLog(`Send message error: ${error.message}`);
      return handleError(res, 500, "Failed to send message", error);
    }
  }

  // Evaluate user answer using AI
  static async evaluateAnswer(req, res) {
    try {
      const userId = req.user.id;
      const {
        sessionId,
        question,
        user_answer,
        expected_topics = [],
        module_number,
        program_id,
        skill_level = "beginner",
      } = req.body;

      // Validate required fields
      if (!question || !user_answer) {
        return handleError(res, 400, "Question and user answer are required");
      }

      // Check user's chat limits
      const limitCheck = await AIChatController.checkChatLimits(userId);
      if (!limitCheck.canChat) {
        return res.status(403).json({
          success: false,
          message: "Free chat limit reached. Please upgrade your subscription.",
          data: {
            remainingChats: 0,
            subscriptionRequired: true,
          },
        });
      }

      try {
        // Call AI evaluation API
        const aiResponse = await axios.post(
          `${AI_API_BASE_URL}/chat/evaluate`,
          {
            question: question,
            user_answer: user_answer,
            expected_topics: expected_topics,
            module_number: module_number,
            program_id: program_id,
            session_id: sessionId || crypto.randomUUID(),
            skill_level: skill_level,
          },
          {
            timeout: AI_API_TIMEOUT,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const evaluationData = aiResponse.data;

        // If sessionId provided, save evaluation to chat history
        if (sessionId) {
          const chatSession = await AIChat.findOne({
            sessionId,
            user: userId,
            status: "active",
          });

          if (chatSession) {
            const evaluationMessage = {
              _id: new mongoose.Types.ObjectId(),
              role: "evaluation",
              content: `Question: ${question}\nAnswer: ${user_answer}\nFeedback: ${evaluationData.feedback}`,
              timestamp: new Date(),
              metadata: {
                evaluation: true,
                is_correct: evaluationData.is_correct,
                score: evaluationData.score,
                feedback: evaluationData.feedback,
                missing_points: evaluationData.missing_points || [],
                strengths: evaluationData.strengths || [],
                areas_for_improvement:
                  evaluationData.areas_for_improvement || [],
                sources: evaluationData.sources || [],
                tokens_used: evaluationData.metadata?.tokens_used || 0,
              },
            };

            chatSession.messages.push(evaluationMessage);
            chatSession.metadata.totalTokensUsed +=
              evaluationData.metadata?.tokens_used || 0;
            chatSession.lastActivity = new Date();
            await chatSession.save();
          }
        }

        // Update user's AI interaction count
        await AIChatController.updateUserAIStats(userId);

        devLog(
          `Answer evaluated for user: ${userId}, score: ${evaluationData.score}`
        );

        return handleSuccess(
          res,
          200,
          {
            is_correct: evaluationData.is_correct,
            score: evaluationData.score,
            feedback: evaluationData.feedback,
            missing_points: evaluationData.missing_points || [],
            strengths: evaluationData.strengths || [],
            areas_for_improvement: evaluationData.areas_for_improvement || [],
            next_question_suggested: evaluationData.next_question_suggested,
            sources: evaluationData.sources || [],
            metadata: evaluationData.metadata || {},
            remainingChats: limitCheck.remainingChats - 1,
          },
          "Answer evaluated successfully"
        );
      } catch (aiError) {
        devLog(`AI Evaluation API Error: ${aiError.message}`);
        return handleError(
          res,
          503,
          "AI evaluation service is temporarily unavailable. Please try again later."
        );
      }
    } catch (error) {
      devLog(`Evaluate answer error: ${error.message}`);
      return handleError(res, 500, "Failed to evaluate answer", error);
    }
  }

  // Get chat history
  static async getChatHistory(req, res) {
    try {
      const userId = req.user.id;
      const { sessionId } = req.params;

      const chatSession = await AIChat.findOne({
        _id: sessionId,
        userId,
        isActive: true,
      });

      if (!chatSession) {
        return handleError(res, 404, "Chat session not found");
      }

      return handleSuccess(
        res,
        200,
        {
          sessionId: chatSession._id,
          context: chatSession.context,
          contextId: chatSession.contextId,
          messages: chatSession.messages,
          tokenUsage: chatSession.tokenUsage,
          createdAt: chatSession.createdAt,
        },
        "Chat history retrieved successfully"
      );
    } catch (error) {
      devLog(`Get chat history error: ${error.message}`);
      return handleError(res, 500, "Failed to get chat history", error);
    }
  }

  // Get user's chat sessions
  static async getUserSessions(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const sessions = await AIChat.find(
        { userId, isActive: true },
        {
          messages: { $slice: 1 }, // Only first message for preview
          tokenUsage: 1,
          context: 1,
          contextId: 1,
          createdAt: 1,
          updatedAt: 1,
        }
      )
        .sort({ updatedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const totalSessions = await AIChat.countDocuments({
        userId,
        isActive: true,
      });

      const formattedSessions = sessions.map((session) => ({
        sessionId: session._id,
        preview: session.messages[0]?.content || "New chat",
        context: session.context,
        lastActive: session.updatedAt,
        tokenUsage: session.tokenUsage,
      }));

      return handleSuccess(
        res,
        200,
        {
          sessions: formattedSessions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalSessions,
            pages: Math.ceil(totalSessions / limit),
          },
        },
        "User chat sessions retrieved successfully"
      );
    } catch (error) {
      devLog(`Get user sessions error: ${error.message}`);
      return handleError(res, 500, "Failed to get chat sessions", error);
    }
  }

  // End chat session
  static async endSession(req, res) {
    try {
      const userId = req.user.id;
      const { sessionId } = req.params;

      const chatSession = await AIChat.findOneAndUpdate(
        { _id: sessionId, userId, isActive: true },
        { isActive: false, endedAt: new Date() },
        { new: true }
      );

      if (!chatSession) {
        return handleError(res, 404, "Chat session not found");
      }

      devLog(`Chat session ended: ${sessionId}`);

      return handleSuccess(
        res,
        200,
        {
          sessionId: chatSession._id,
          endedAt: chatSession.endedAt,
        },
        "Chat session ended successfully"
      );
    } catch (error) {
      devLog(`End session error: ${error.message}`);
      return handleError(res, 500, "Failed to end chat session", error);
    }
  }

  // Rate chat interaction
  static async rateInteraction(req, res) {
    try {
      const userId = req.user.id;
      const { sessionId } = req.params;
      const { rating, feedback } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return handleError(res, 400, "Rating must be between 1 and 5");
      }

      const chatSession = await AIChat.findOneAndUpdate(
        { _id: sessionId, userId },
        {
          userRating: rating,
          userFeedback: feedback || null,
          ratedAt: new Date(),
        },
        { new: true }
      );

      if (!chatSession) {
        return handleError(res, 404, "Chat session not found");
      }

      devLog(`Chat session rated: ${sessionId}, rating: ${rating}`);

      return handleSuccess(
        res,
        200,
        {
          sessionId: chatSession._id,
          rating: chatSession.userRating,
          feedback: chatSession.userFeedback,
        },
        "Chat interaction rated successfully"
      );
    } catch (error) {
      devLog(`Rate interaction error: ${error.message}`);
      return handleError(res, 500, "Failed to rate chat interaction", error);
    }
  }

  // Helper method to check chat limits
  static async checkChatLimits(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { canChat: false, remainingChats: 0, reason: "User not found" };
      }

      // Check if user has active subscription
      const subscription = await Subscription.findOne({
        user: userId,
        status: "active",
      });

      if (subscription) {
        // Check subscription plan limits
        if (
          subscription.planId === "ai_coach" ||
          subscription.planId === "full_access"
        ) {
          return {
            canChat: true,
            remainingChats: -1,
            plan: subscription.planId,
          }; // unlimited
        }
        if (subscription.planId === "exam_prep") {
          return {
            canChat: false,
            remainingChats: 0,
            reason: "AI chat not included in Exam Preparation plan",
          };
        }
      }

      // Free user - check monthly limit (3 chats per month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyChats = await AIChat.countDocuments({
        user: userId,
        createdAt: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1),
        },
      });

      const freeLimit = 3;
      const remainingChats = Math.max(0, freeLimit - monthlyChats);

      return {
        canChat: remainingChats > 0,
        remainingChats,
        plan: "free",
      };
    } catch (error) {
      devLog(`Check chat limits error: ${error.message}`);
      return {
        canChat: false,
        remainingChats: 0,
        reason: "Error checking limits",
      };
    }
  }

  // Helper method to update user AI stats
  static async updateUserAIStats(userId) {
    try {
      await User.findByIdAndUpdate(userId, {
        $inc: { "stats.aiInteractions": 1 },
        $set: { "stats.lastAIInteraction": new Date() },
      });
    } catch (error) {
      devLog(`Update user AI stats error: ${error.message}`);
    }
  }

  // Get session (alias for getChatHistory)
  static async getSession(req, res) {
    try {
      const userId = req.user.id;
      const { sessionId } = req.params;

      const chatSession = await AIChat.findOne({
        sessionId,
        user: userId,
      });

      if (!chatSession) {
        return handleError(res, 404, "Chat session not found");
      }

      return handleSuccess(
        res,
        200,
        {
          sessionId: chatSession.sessionId,
          title: chatSession.title,
          context: chatSession.context,
          messages: chatSession.messages,
          metadata: chatSession.metadata,
          createdAt: chatSession.createdAt,
          lastActivity: chatSession.lastActivity,
        },
        "Chat session retrieved successfully"
      );
    } catch (error) {
      devLog(`Get session error: ${error.message}`);
      return handleError(res, 500, "Failed to get session", error);
    }
  }

  // Update session
  static async updateSession(req, res) {
    try {
      const userId = req.user.id;
      const { sessionId } = req.params;
      const { title, status } = req.body;

      const updates = {};
      if (title) updates.title = title;
      if (status) updates.status = status;

      const chatSession = await AIChat.findOneAndUpdate(
        { sessionId, user: userId },
        updates,
        { new: true }
      );

      if (!chatSession) {
        return handleError(res, 404, "Chat session not found");
      }

      devLog(`Chat session updated: ${sessionId}`);

      return handleSuccess(
        res,
        200,
        {
          sessionId: chatSession.sessionId,
          title: chatSession.title,
          status: chatSession.status,
        },
        "Chat session updated successfully"
      );
    } catch (error) {
      devLog(`Update session error: ${error.message}`);
      return handleError(res, 500, "Failed to update session", error);
    }
  }

  // Delete session
  static async deleteSession(req, res) {
    try {
      const userId = req.user.id;
      const { sessionId } = req.params;

      const chatSession = await AIChat.findOneAndUpdate(
        { sessionId, user: userId },
        { status: "deleted" },
        { new: true }
      );

      if (!chatSession) {
        return handleError(res, 404, "Chat session not found");
      }

      devLog(`Chat session deleted: ${sessionId}`);

      return handleSuccess(
        res,
        200,
        {
          sessionId: chatSession.sessionId,
        },
        "Chat session deleted successfully"
      );
    } catch (error) {
      devLog(`Delete session error: ${error.message}`);
      return handleError(res, 500, "Failed to delete session", error);
    }
  }

  // Submit feedback
  static async submitFeedback(req, res) {
    try {
      const userId = req.user.id;
      const { sessionId } = req.params;
      const { rating, feedback, messageId } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return handleError(res, 400, "Rating must be between 1 and 5");
      }

      const chatSession = await AIChat.findOne({
        sessionId,
        user: userId,
      });

      if (!chatSession) {
        return handleError(res, 404, "Chat session not found");
      }

      // If messageId provided, add feedback to specific message
      if (messageId) {
        const message = chatSession.messages.id(messageId);
        if (message) {
          message.metadata = {
            ...message.metadata,
            userRating: rating,
            userFeedback: feedback,
            ratedAt: new Date(),
          };
        }
      }

      // Add overall session feedback
      chatSession.metadata.userRating = rating;
      chatSession.metadata.userFeedback = feedback;
      chatSession.metadata.ratedAt = new Date();

      await chatSession.save();

      devLog(`Feedback submitted for session: ${sessionId}, rating: ${rating}`);

      return handleSuccess(
        res,
        200,
        {
          sessionId: chatSession.sessionId,
          rating,
          feedback,
        },
        "Feedback submitted successfully"
      );
    } catch (error) {
      devLog(`Submit feedback error: ${error.message}`);
      return handleError(res, 500, "Failed to submit feedback", error);
    }
  }
}

export default AIChatController;
