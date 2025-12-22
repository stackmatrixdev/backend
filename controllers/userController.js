// controllers/userController.js

import User from "../models/User.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";

class UserController {
  // Get user profile
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return handleError(res, 404, "User not found");
      }
      handleSuccess(res, 200, user, "User profile fetched successfully");
    } catch (error) {
      handleError(res, 500, "Failed to fetch user profile", error);
    }
  }

  // updateProfile
  static async updateProfile(req, res) {
    try {
      const updates = req.body; /// Get updates from request body
      const user = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");

      // Check if user exists
      if (!user) {
        return handleError(res, 404, "User not found");
      }

      handleSuccess(res, 200, user, "User profile updated successfully");
    } catch (error) {
      handleError(res, 500, "Failed to update user profile", error);
    }
  }

  // Get dashboard stats
  static async getDashboardStats(req, res) {
    try {
      const userId = req.user.id;

      // Get user with stats
      const user = await User.findById(userId).select(
        "name email avatar stats goals achievements"
      );
      if (!user) {
        return handleError(res, 404, "User not found");
      }

      // Get recent quiz attempts (last 5)
      const recentAttempts = await QuizAttempt.find({
        userId,
        status: { $in: ["completed", "submitted"] },
      })
        .populate("programId", "name")
        .sort({ submittedAt: -1 })
        .limit(5)
        .select("programId score percentage totalMarks submittedAt");

      // Format recent quiz results
      const recentQuizzes = recentAttempts.map((attempt) => ({
        quizName: attempt.programId?.name || "Unknown Quiz",
        score: attempt.percentage || 0,
        date: attempt.submittedAt,
        grade: getGrade(attempt.percentage),
      }));

      // Calculate weekly study progress
      const currentWeeklyHours = user.stats?.studyHours || 0;
      const weeklyGoal = user.goals?.weeklyStudyGoal || 15;
      const weeklyProgress = Math.min(
        (currentWeeklyHours / weeklyGoal) * 100,
        100
      );

      // Calculate monthly quiz progress
      const currentMonthQuizzes = user.stats?.quizzesCompleted || 0;
      const monthlyQuizGoal = user.goals?.monthlyQuizGoal || 10;
      const monthlyProgress = Math.min(
        (currentMonthQuizzes / monthlyQuizGoal) * 100,
        100
      );

      const dashboardData = {
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        stats: {
          quizzesCompleted: user.stats?.quizzesCompleted || 0,
          averageScore: Math.round(user.stats?.averageScore || 0),
          aiInteractions: user.stats?.aiInteractions || 0,
        },
        goals: {
          weeklyStudy: {
            current: currentWeeklyHours,
            target: weeklyGoal,
            progress: Math.round(weeklyProgress),
          },
          monthlyQuizzes: {
            current: currentMonthQuizzes,
            target: monthlyQuizGoal,
            progress: Math.round(monthlyProgress),
          },
        },
        recentQuizzes,
        achievements: user.achievements?.slice(-2) || [], // Last 2 achievements
      };

      handleSuccess(
        res,
        200,
        dashboardData,
        "Dashboard stats fetched successfully"
      );
    } catch (error) {
      handleError(res, 500, "Failed to fetch dashboard stats", error);
    }
  }
}

// Helper function to determine grade
function getGrade(percentage) {
  if (percentage >= 90) return "Excellence";
  if (percentage >= 80) return "Very Good";
  if (percentage >= 70) return "Good";
  if (percentage >= 60) return "Pass";
  return "Needs Improvement";
}

export default UserController;
