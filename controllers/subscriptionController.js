import Subscription from "../models/Subscription.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

class SubscriptionController {
  // Get all available subscription plans
  static async getPlans(req, res) {
    try {
      const plans = [
        {
          id: "exam_prep",
          name: "Exam Preparation",
          price: 19.99,
          currency: "USD",
          billingCycle: "monthly",
          features: [
            "Access to all exam practice tests",
            "Detailed explanations for answers",
            "Progress tracking",
            "Performance analytics",
            "Mobile app access",
          ],
          limits: {
            quizzes: "unlimited",
            aiChats: 0,
            certificates: true,
            programs: "exam-only",
          },
          popular: false,
        },
        {
          id: "ai_coach",
          name: "AI Study Coach",
          price: 19.99,
          currency: "USD",
          billingCycle: "monthly",
          features: [
            "Unlimited AI study assistance",
            "Personalized study plans",
            "Real-time doubt clearing",
            "Study tips and strategies",
            "Progress monitoring",
          ],
          limits: {
            quizzes: "basic",
            aiChats: "unlimited",
            certificates: false,
            programs: "limited",
          },
          popular: false,
        },
        {
          id: "full_access",
          name: "Full Access",
          price: 29.99,
          currency: "USD",
          billingCycle: "monthly",
          features: [
            "Everything in Exam Preparation",
            "Everything in AI Study Coach",
            "Premium content access",
            "Priority support",
            "Advanced analytics",
            "Custom study plans",
            "All future features",
          ],
          limits: {
            quizzes: "unlimited",
            aiChats: "unlimited",
            certificates: true,
            programs: "unlimited",
          },
          popular: true,
        },
      ];

      return res.status(200).json({
        success: true,
        message: "Subscription plans retrieved successfully",
        data: plans,
      });
    } catch (error) {
      console.error("Get subscription plans error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve subscription plans",
      });
    }
  }

  // Get user's current subscription
  static async getUserSubscription(req, res) {
    try {
      const userId = req.user.id;

      const subscription = await Subscription.findOne({
        user: userId,
        status: { $in: ["active", "past_due"] },
      }).populate("user", "name email");

      if (!subscription) {
        return res.status(200).json({
          success: true,
          message: "No active subscription found",
          data: {
            hasSubscription: false,
            plan: "free",
            limits: {
              quizzes: 3, // 3 free quizzes per month
              aiChats: 3, // 3 free AI chats per month
              certificates: false,
              programs: "basic",
            },
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "User subscription retrieved successfully",
        data: {
          hasSubscription: true,
          subscription,
        },
      });
    } catch (error) {
      console.error("Get user subscription error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve user subscription",
      });
    }
  }

  // Create new subscription
  static async createSubscription(req, res) {
    try {
      const { planId, paymentMethodId } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!planId) {
        return res.status(400).json({
          success: false,
          message: "Plan ID is required",
        });
      }

      // Check if user already has an active subscription
      const existingSubscription = await Subscription.findOne({
        user: userId,
        status: "active",
      });

      if (existingSubscription) {
        return res.status(400).json({
          success: false,
          message: "User already has an active subscription",
        });
      }

      // Plan details mapping
      const planDetails = {
        exam_prep: {
          name: "Exam Preparation",
          price: 19.99,
          features: ["unlimited_quizzes", "progress_tracking", "certificates"],
        },
        ai_coach: {
          name: "AI Study Coach",
          price: 19.99,
          features: ["unlimited_ai_chats", "study_plans", "doubt_clearing"],
        },
        full_access: {
          name: "Full Access",
          price: 29.99,
          features: [
            "unlimited_quizzes",
            "unlimited_ai_chats",
            "certificates",
            "premium_content",
          ],
        },
      };

      if (!planDetails[planId]) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan ID",
        });
      }

      // Create subscription record
      const subscription = new Subscription({
        user: userId,
        planId,
        planName: planDetails[planId].name,
        amount: planDetails[planId].price,
        currency: "USD",
        billingCycle: "monthly",
        status: "active", // In real implementation, this would be 'pending' until payment confirmed
        features: planDetails[planId].features,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        usage: {
          quizzesTaken: 0,
          aiChatsUsed: 0,
          certificatesGenerated: 0,
        },
      });

      await subscription.save();

      // Update user subscription status
      await User.findByIdAndUpdate(userId, {
        subscription: {
          planId,
          status: "active",
          subscribedAt: new Date(),
        },
      });

      return res.status(201).json({
        success: true,
        message: "Subscription created successfully",
        data: subscription,
      });
    } catch (error) {
      console.error("Create subscription error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create subscription",
      });
    }
  }

  // Cancel subscription
  static async cancelSubscription(req, res) {
    try {
      const { subscriptionId } = req.params;
      const userId = req.user.id;

      const subscription = await Subscription.findOne({
        _id: subscriptionId,
        user: userId,
        status: "active",
      });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "Active subscription not found",
        });
      }

      // Update subscription status
      subscription.status = "canceled";
      subscription.canceledAt = new Date();
      await subscription.save();

      // Update user subscription status
      await User.findByIdAndUpdate(userId, {
        subscription: {
          planId: "free",
          status: "canceled",
          canceledAt: new Date(),
        },
      });

      return res.status(200).json({
        success: true,
        message: "Subscription canceled successfully",
        data: subscription,
      });
    } catch (error) {
      console.error("Cancel subscription error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to cancel subscription",
      });
    }
  }

  // Check usage limits for current user
  static async checkUsageLimit(req, res) {
    try {
      const { type } = req.body; // 'quiz' or 'aiChat'
      const userId = req.user.id;

      // Get user's current subscription
      const subscription = await Subscription.findOne({
        user: userId,
        status: "active",
      });

      // Define limits for free and paid plans
      const limits = {
        free: { quizzes: 3, aiChats: 3 },
        exam_prep: { quizzes: -1, aiChats: 0 }, // -1 means unlimited, 0 means none
        ai_coach: { quizzes: 10, aiChats: -1 },
        full_access: { quizzes: -1, aiChats: -1 },
      };

      const userPlan = subscription ? subscription.planId : "free";
      const planLimits = limits[userPlan];

      if (!planLimits) {
        return res.status(400).json({
          success: false,
          message: "Invalid subscription plan",
        });
      }

      // Get current usage
      const currentUsage = subscription
        ? subscription.usage
        : { quizzesTaken: 0, aiChatsUsed: 0 };

      let canUse = false;
      let remainingUses = 0;

      if (type === "quiz") {
        if (planLimits.quizzes === -1) {
          canUse = true;
          remainingUses = -1; // unlimited
        } else {
          remainingUses = Math.max(
            0,
            planLimits.quizzes - currentUsage.quizzesTaken
          );
          canUse = remainingUses > 0;
        }
      } else if (type === "aiChat") {
        if (planLimits.aiChats === -1) {
          canUse = true;
          remainingUses = -1; // unlimited
        } else {
          remainingUses = Math.max(
            0,
            planLimits.aiChats - currentUsage.aiChatsUsed
          );
          canUse = remainingUses > 0;
        }
      }

      return res.status(200).json({
        success: true,
        message: "Usage limit checked successfully",
        data: {
          canUse,
          remainingUses,
          currentPlan: userPlan,
          type,
          usage: currentUsage,
        },
      });
    } catch (error) {
      console.error("Check usage limit error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to check usage limit",
      });
    }
  }

  // Update usage after user completes an action
  static async updateUsage(req, res) {
    try {
      const { type } = req.body; // 'quiz' or 'aiChat'
      const userId = req.user.id;

      const subscription = await Subscription.findOne({
        user: userId,
        status: "active",
      });

      if (!subscription) {
        return res.status(200).json({
          success: true,
          message: "No active subscription to update usage for",
        });
      }

      // Update usage count
      if (type === "quiz") {
        subscription.usage.quizzesTaken += 1;
      } else if (type === "aiChat") {
        subscription.usage.aiChatsUsed += 1;
      }

      subscription.usage.lastUpdated = new Date();
      await subscription.save();

      return res.status(200).json({
        success: true,
        message: "Usage updated successfully",
        data: subscription.usage,
      });
    } catch (error) {
      console.error("Update usage error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update usage",
      });
    }
  }

  // Get subscription analytics (admin)
  static async getSubscriptionAnalytics(req, res) {
    try {
      // Check if user is admin (should be handled by admin middleware)
      if (req.user.role !== "admin" && req.user.role !== "superadmin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      const analytics = await Subscription.aggregate([
        // Group by plan and status
        {
          $group: {
            _id: {
              planId: "$planId",
              status: "$status",
            },
            count: { $sum: 1 },
            totalRevenue: { $sum: "$amount" },
            avgAmount: { $avg: "$amount" },
          },
        },
        // Sort by count descending
        { $sort: { count: -1 } },
      ]);

      // Get total statistics
      const totalStats = await Subscription.aggregate([
        {
          $group: {
            _id: null,
            totalSubscriptions: { $sum: 1 },
            totalRevenue: { $sum: "$amount" },
            activeSubscriptions: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
            canceledSubscriptions: {
              $sum: { $cond: [{ $eq: ["$status", "canceled"] }, 1, 0] },
            },
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        message: "Subscription analytics retrieved successfully",
        data: {
          analytics,
          totals: totalStats[0] || {
            totalSubscriptions: 0,
            totalRevenue: 0,
            activeSubscriptions: 0,
            canceledSubscriptions: 0,
          },
        },
      });
    } catch (error) {
      console.error("Get subscription analytics error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve subscription analytics",
      });
    }
  }
}

export default SubscriptionController;
