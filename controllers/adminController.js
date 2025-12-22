import User from "../models/User.model.js";
import Program from "../models/Program.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
import AIChat from "../models/AIChat.model.js";
import Topic from "../models/Topic.model.js";
import Subscription from "../models/Subscription.model.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";
import { devLog } from "../utils/helper.js";

class AdminController {
  // Get dashboard statistics
  static async getDashboardStats(req, res) {
    try {
      // Only admin can access
      if (req.user.role !== "admin") {
        return handleError(
          res,
          403,
          "Access denied. Admin privileges required."
        );
      }

      // Get all statistics in parallel
      const [
        totalUsers,
        totalPrograms,
        totalTopics,
        totalQuizAttempts,
        totalAIChats,
        totalSubscriptions,
        totalRevenue,
        activeUsers,
        recentAttempts,
        topPrograms,
        topScorers,
      ] = await Promise.all([
        User.countDocuments({ role: "user" }),
        Program.countDocuments(),
        Topic.countDocuments(),
        QuizAttempt.countDocuments(),
        AIChat.countDocuments(),
        Subscription.countDocuments({ status: "active" }),
        Subscription.aggregate([
          {
            $match: { status: "active" },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$amount" },
            },
          },
        ]),
        User.countDocuments({
          role: "user",
          updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        }),
        QuizAttempt.find({ status: "completed" })
          .populate("userId", "name email")
          .populate("programId", "name")
          .sort({ submittedAt: -1 })
          .limit(10),
        Program.aggregate([
          {
            $lookup: {
              from: "quizattempts",
              localField: "_id",
              foreignField: "programId",
              as: "attempts",
            },
          },
          {
            $addFields: {
              attemptsCount: { $size: "$attempts" },
              avgScore: { $avg: "$attempts.percentage" },
            },
          },
          {
            $sort: { attemptsCount: -1 },
          },
          {
            $limit: 5,
          },
          {
            $project: {
              name: 1,
              category: 1,
              attemptsCount: 1,
              avgScore: { $round: ["$avgScore", 1] },
            },
          },
        ]),
        // Get top 5 users by average quiz score
        User.aggregate([
          {
            $lookup: {
              from: "quizattempts",
              localField: "_id",
              foreignField: "userId",
              as: "attempts",
            },
          },
          {
            $match: {
              role: "user",
              "attempts.0": { $exists: true }, // Only users with quiz attempts
            },
          },
          {
            $addFields: {
              avgScore: { $avg: "$attempts.percentage" },
              totalAttempts: { $size: "$attempts" },
            },
          },
          {
            $match: {
              avgScore: { $gte: 0 }, // Valid scores only
              totalAttempts: { $gte: 1 }, // At least 1 attempt
            },
          },
          {
            $sort: { avgScore: -1 },
          },
          {
            $limit: 5,
          },
          {
            $project: {
              name: 1,
              email: 1,
              avatar: 1,
              avgScore: { $round: ["$avgScore", 0] },
              totalAttempts: 1,
            },
          },
        ]),
      ]);

      // Calculate growth rates (simplified - compare with last week)
      const lastWeekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const [usersLastWeek, attemptsLastWeek, revenueData] = await Promise.all([
        User.countDocuments({
          role: "user",
          createdAt: { $gte: lastWeekStart },
        }),
        QuizAttempt.countDocuments({
          createdAt: { $gte: lastWeekStart },
        }),
        // Get monthly revenue data for charts (last 10 months)
        Subscription.aggregate([
          {
            $match: {
              status: "active",
              createdAt: {
                $gte: new Date(Date.now() - 10 * 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              revenue: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          {
            $sort: { "_id.year": 1, "_id.month": 1 },
          },
          {
            $limit: 10,
          },
        ]),
      ]);

      // Get user registration data for charts (last 10 months)
      const userGrowthData = await User.aggregate([
        {
          $match: {
            role: "user",
            createdAt: {
              $gte: new Date(Date.now() - 10 * 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
        {
          $limit: 10,
        },
      ]);

      // Format chart data
      const revenueChartData = revenueData.map((item) => item.revenue || 0);
      const userChartData = userGrowthData.map((item) => item.count || 0);
      const chartLabels = revenueData.map((item, index) => index + 1); // Simple 1-10 labels

      // Calculate total revenue
      const currentRevenue = totalRevenue[0]?.totalRevenue || 0;

      // Format top scorers
      const formattedTopScorers = topScorers.map((user, index) => ({
        name: user.name || "Anonymous",
        score: user.avgScore || 0,
        avatar: user.avatar || null,
        totalAttempts: user.totalAttempts || 0,
        rank: index + 1,
      }));

      // Format recent attempts
      const formattedRecentAttempts = recentAttempts.map((attempt) => ({
        id: attempt._id,
        user: attempt.userId?.name || "Unknown",
        program: attempt.programId?.name || "Unknown",
        score: `${attempt.score}/${attempt.totalMarks}`,
        percentage: `${attempt.percentage}%`,
        passed: attempt.passed,
        date: attempt.submittedAt,
      }));

      const stats = {
        overview: {
          totalUsers,
          totalPrograms,
          totalTopics,
          totalQuizAttempts,
          totalAIChats,
          totalSubscriptions,
          totalRevenue: currentRevenue,
          activeUsers,
        },
        growth: {
          newUsersThisWeek: usersLastWeek,
          newAttemptsThisWeek: attemptsLastWeek,
        },
        charts: {
          revenueData: revenueChartData,
          userData: userChartData,
          labels: chartLabels,
        },
        recentActivity: {
          recentAttempts: formattedRecentAttempts,
          topPrograms,
          topScorers: formattedTopScorers,
        },
      };

      devLog(`Admin dashboard stats retrieved by: ${req.user.id}`);

      return handleSuccess(
        res,
        200,
        stats,
        "Dashboard statistics retrieved successfully"
      );
    } catch (error) {
      devLog(`Get dashboard stats error: ${error.message}`);
      return handleError(res, 500, "Failed to get dashboard statistics", error);
    }
  }

  // Get all users with filtering
  static async getAllUsers(req, res) {
    try {
      if (req.user.role !== "admin") {
        return handleError(
          res,
          403,
          "Access denied. Admin privileges required."
        );
      }

      const {
        page = 1,
        limit = 10,
        search,
        role = "user",
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      // Build filter
      const filter = { role };
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Build sort
      const sort = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      const users = await User.find(filter)
        .select(
          "-password -forgotPasswordRequestsAllowed -forgotPasswordExpires"
        )
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const totalUsers = await User.countDocuments(filter);

      return handleSuccess(
        res,
        200,
        {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalUsers,
            pages: Math.ceil(totalUsers / limit),
          },
        },
        "Users retrieved successfully"
      );
    } catch (error) {
      devLog(`Get all users error: ${error.message}`);
      return handleError(res, 500, "Failed to get users", error);
    }
  }

  // Get all quiz attempts with filtering
  static async getAllQuizAttempts(req, res) {
    try {
      if (req.user.role !== "admin") {
        return handleError(
          res,
          403,
          "Access denied. Admin privileges required."
        );
      }

      const {
        page = 1,
        limit = 10,
        status,
        programId,
        dateFrom,
        dateTo,
      } = req.query;

      // Build filter
      const filter = {};
      if (status) filter.status = status;
      if (programId) filter.programId = programId;
      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo);
      }

      const attempts = await QuizAttempt.find(filter)
        .populate("userId", "name email")
        .populate("programId", "name topic category")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const totalAttempts = await QuizAttempt.countDocuments(filter);

      const formattedAttempts = attempts.map((attempt) => ({
        id: attempt._id,
        user: {
          id: attempt.userId?._id,
          name: attempt.userId?.name || "Unknown",
          email: attempt.userId?.email,
        },
        program: {
          id: attempt.programId?._id,
          name: attempt.programId?.name || "Unknown",
          topic: attempt.programId?.topic,
          category: attempt.programId?.category,
        },
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        percentage: attempt.percentage,
        passed: attempt.passed,
        status: attempt.status,
        timeTaken: attempt.timeTaken,
        timeAllocated: attempt.timeAllocated,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
      }));

      return handleSuccess(
        res,
        200,
        {
          attempts: formattedAttempts,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalAttempts,
            pages: Math.ceil(totalAttempts / limit),
          },
        },
        "Quiz attempts retrieved successfully"
      );
    } catch (error) {
      devLog(`Get all quiz attempts error: ${error.message}`);
      return handleError(res, 500, "Failed to get quiz attempts", error);
    }
  }

  // Update program status (activate/deactivate)
  static async updateProgramStatus(req, res) {
    try {
      if (req.user.role !== "admin") {
        return handleError(
          res,
          403,
          "Access denied. Admin privileges required."
        );
      }

      const { programId } = req.params;
      const { status } = req.body;

      if (!["draft", "published", "archived"].includes(status)) {
        return handleError(
          res,
          400,
          "Invalid status. Must be: draft, published, or archived"
        );
      }

      const program = await Program.findByIdAndUpdate(
        programId,
        { status, updatedAt: new Date() },
        { new: true }
      );

      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      devLog(
        `Program status updated by admin: ${req.user.id}, program: ${programId}, status: ${status}`
      );

      return handleSuccess(
        res,
        200,
        {
          programId: program._id,
          name: program.name,
          status: program.status,
          updatedAt: program.updatedAt,
        },
        `Program ${status} successfully`
      );
    } catch (error) {
      devLog(`Update program status error: ${error.message}`);
      return handleError(res, 500, "Failed to update program status", error);
    }
  }

  // Delete program (admin only)
  static async deleteProgram(req, res) {
    try {
      if (req.user.role !== "admin") {
        return handleError(
          res,
          403,
          "Access denied. Admin privileges required."
        );
      }

      const { programId } = req.params;

      // Check if program has quiz attempts
      const hasAttempts = await QuizAttempt.exists({ programId });
      if (hasAttempts) {
        return handleError(
          res,
          400,
          "Cannot delete program with existing quiz attempts. Archive it instead."
        );
      }

      const program = await Program.findByIdAndDelete(programId);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      devLog(`Program deleted by admin: ${req.user.id}, program: ${programId}`);

      return handleSuccess(
        res,
        200,
        {
          programId,
          name: program.name,
        },
        "Program deleted successfully"
      );
    } catch (error) {
      devLog(`Delete program error: ${error.message}`);
      return handleError(res, 500, "Failed to delete program", error);
    }
  }

  // Get analytics data
  static async getAnalytics(req, res) {
    try {
      if (req.user.role !== "admin") {
        return handleError(
          res,
          403,
          "Access denied. Admin privileges required."
        );
      }

      const { period = "7d" } = req.query;

      let dateFrom;
      switch (period) {
        case "24h":
          dateFrom = new Date(Date.now() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      }

      // User registration trend
      const userRegistrations = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: dateFrom },
            role: "user",
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Quiz attempts trend
      const quizAttempts = await QuizAttempt.aggregate([
        {
          $match: {
            createdAt: { $gte: dateFrom },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Program categories performance
      const categoryStats = await Program.aggregate([
        {
          $lookup: {
            from: "quizattempts",
            localField: "_id",
            foreignField: "programId",
            as: "attempts",
          },
        },
        {
          $group: {
            _id: "$category",
            programCount: { $sum: 1 },
            totalAttempts: { $sum: { $size: "$attempts" } },
            avgScore: { $avg: { $avg: "$attempts.percentage" } },
          },
        },
        {
          $project: {
            category: "$_id",
            programCount: 1,
            totalAttempts: 1,
            avgScore: { $round: ["$avgScore", 1] },
          },
        },
      ]);

      return handleSuccess(
        res,
        200,
        {
          period,
          userRegistrations,
          quizAttempts,
          categoryStats,
        },
        "Analytics data retrieved successfully"
      );
    } catch (error) {
      devLog(`Get analytics error: ${error.message}`);
      return handleError(res, 500, "Failed to get analytics data", error);
    }
  }

  // Bulk operations
  static async bulkUpdatePrograms(req, res) {
    try {
      if (req.user.role !== "admin") {
        return handleError(
          res,
          403,
          "Access denied. Admin privileges required."
        );
      }

      const { programIds, action, value } = req.body;

      if (
        !programIds ||
        !Array.isArray(programIds) ||
        programIds.length === 0
      ) {
        return handleError(res, 400, "Program IDs array is required");
      }

      let updateData = {};

      switch (action) {
        case "status":
          if (!["draft", "published", "archived"].includes(value)) {
            return handleError(res, 400, "Invalid status value");
          }
          updateData.status = value;
          break;
        case "category":
          updateData.category = value;
          break;
        default:
          return handleError(
            res,
            400,
            "Invalid action. Supported: status, category"
          );
      }

      updateData.updatedAt = new Date();

      const result = await Program.updateMany(
        { _id: { $in: programIds } },
        updateData
      );

      devLog(
        `Bulk update performed by admin: ${req.user.id}, action: ${action}, affected: ${result.modifiedCount}`
      );

      return handleSuccess(
        res,
        200,
        {
          action,
          value,
          totalPrograms: programIds.length,
          updatedPrograms: result.modifiedCount,
        },
        `Bulk ${action} update completed successfully`
      );
    } catch (error) {
      devLog(`Bulk update programs error: ${error.message}`);
      return handleError(res, 500, "Failed to perform bulk update", error);
    }
  }
}

export default AdminController;
