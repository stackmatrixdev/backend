import Program from "../models/Program.model.js";
import Quiz from "../models/Quiz.model.js";
import Question from "../models/Question.model.js";
import Topic from "../models/Topic.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";
import { devLog } from "../utils/helper.js";

class QuizController {
  // Get all quizzes with filtering and pagination
  static async getAllQuizzes(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        difficulty,
        status,
        program,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const query = {};

      // Apply filters
      if (type) query.type = type;
      if (difficulty) query.difficulty = difficulty;
      if (status) query.status = status;
      if (program) query.program = program;

      // Search functionality
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
        populate: [
          { path: "program", select: "name category" },
          { path: "questions", select: "question type marks difficulty" },
          { path: "createdBy", select: "fullname email" },
        ],
      };

      const quizzes = await Quiz.paginate(query, options);

      return handleSuccess(
        res,
        200,
        {
          quizzes: quizzes.docs,
          totalQuizzes: quizzes.totalDocs,
          totalPages: quizzes.totalPages,
          currentPage: quizzes.page,
          hasNextPage: quizzes.hasNextPage,
          hasPrevPage: quizzes.hasPrevPage,
        },
        "Quizzes retrieved successfully"
      );
    } catch (error) {
      devLog(`Get all quizzes error: ${error.message}`);
      return handleError(res, 500, "Failed to retrieve quizzes", error);
    }
  }

  // Get quiz by ID
  static async getQuizById(req, res) {
    try {
      const { id } = req.params;

      const quiz = await Quiz.findById(id)
        .populate("program", "name category")
        .populate("questions")
        .populate("createdBy", "fullname email");

      if (!quiz) {
        return handleError(res, 404, "Quiz not found");
      }

      return handleSuccess(res, 200, quiz, "Quiz retrieved successfully");
    } catch (error) {
      devLog(`Get quiz by ID error: ${error.message}`);
      return handleError(res, 500, "Failed to retrieve quiz", error);
    }
  }

  // Create new quiz
  static async createQuiz(req, res) {
    try {
      const {
        title,
        description,
        programId,
        type,
        settings,
        questions,
        difficulty,
        tags,
        status = "draft",
      } = req.body;

      const userId = req.user.id;

      // Validate program exists
      const program = await Program.findById(programId);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      // Create new quiz
      const quiz = new Quiz({
        title,
        description,
        program: programId,
        type,
        settings,
        difficulty,
        tags,
        status,
        createdBy: userId,
      });

      await quiz.save();

      // If questions are provided, create them
      if (questions && questions.length > 0) {
        const questionPromises = questions.map((q) => {
          const question = new Question({
            ...q,
            quiz: quiz._id,
            createdBy: userId,
          });
          return question.save();
        });

        const savedQuestions = await Promise.all(questionPromises);
        quiz.questions = savedQuestions.map((q) => q._id);
        await quiz.save();
      }

      // Update program to include this quiz
      program.quizzes.push(quiz._id);
      await program.save();

      const populatedQuiz = await Quiz.findById(quiz._id)
        .populate("program", "name category")
        .populate("questions")
        .populate("createdBy", "fullname email");

      devLog(`Quiz created: ${quiz._id} by user: ${userId}`);

      return handleSuccess(
        res,
        201,
        populatedQuiz,
        "Quiz created successfully"
      );
    } catch (error) {
      devLog(`Create quiz error: ${error.message}`);
      return handleError(res, 500, "Failed to create quiz", error);
    }
  }

  // Update quiz
  static async updateQuiz(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;

      const quiz = await Quiz.findById(id);
      if (!quiz) {
        return handleError(res, 404, "Quiz not found");
      }

      // Check if user has permission to update
      if (quiz.createdBy.toString() !== userId && req.user.role !== "admin") {
        return handleError(res, 403, "Not authorized to update this quiz");
      }

      const updatedQuiz = await Quiz.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
        .populate("program", "name category")
        .populate("questions")
        .populate("createdBy", "fullname email");

      devLog(`Quiz updated: ${id} by user: ${userId}`);

      return handleSuccess(res, 200, updatedQuiz, "Quiz updated successfully");
    } catch (error) {
      devLog(`Update quiz error: ${error.message}`);
      return handleError(res, 500, "Failed to update quiz", error);
    }
  }

  // Delete quiz
  static async deleteQuiz(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const quiz = await Quiz.findById(id);
      if (!quiz) {
        return handleError(res, 404, "Quiz not found");
      }

      // Check if user has permission to delete
      if (quiz.createdBy.toString() !== userId && req.user.role !== "admin") {
        return handleError(res, 403, "Not authorized to delete this quiz");
      }

      // Delete associated questions
      await Question.deleteMany({ quiz: id });

      // Remove quiz from program
      await Program.findByIdAndUpdate(quiz.program, {
        $pull: { quizzes: id },
      });

      // Delete the quiz
      await Quiz.findByIdAndDelete(id);

      devLog(`Quiz deleted: ${id} by user: ${userId}`);

      return handleSuccess(res, 200, null, "Quiz deleted successfully");
    } catch (error) {
      devLog(`Delete quiz error: ${error.message}`);
      return handleError(res, 500, "Failed to delete quiz", error);
    }
  }

  // Get quizzes by program
  static async getQuizzesByProgram(req, res) {
    try {
      const { programId } = req.params;

      const quizzes = await Quiz.find({ program: programId, status: "active" })
        .populate("questions", "question type marks")
        .sort({ createdAt: -1 });

      return handleSuccess(
        res,
        200,
        quizzes,
        "Program quizzes retrieved successfully"
      );
    } catch (error) {
      devLog(`Get quizzes by program error: ${error.message}`);
      return handleError(res, 500, "Failed to retrieve program quizzes", error);
    }
  }

  // Get quiz statistics
  static async getQuizStatistics(req, res) {
    try {
      const { id } = req.params;

      const quiz = await Quiz.findById(id);
      if (!quiz) {
        return handleError(res, 404, "Quiz not found");
      }

      // Get attempt statistics
      const attempts = await QuizAttempt.find({ programId: quiz.program });
      const totalAttempts = attempts.length;
      const completedAttempts = attempts.filter(
        (a) => a.status === "completed"
      ).length;
      const avgScore =
        completedAttempts > 0
          ? attempts
              .filter((a) => a.status === "completed")
              .reduce((sum, a) => sum + a.score, 0) / completedAttempts
          : 0;

      const statistics = {
        totalAttempts,
        completedAttempts,
        avgScore: Math.round(avgScore * 100) / 100,
        completionRate:
          totalAttempts > 0
            ? Math.round((completedAttempts / totalAttempts) * 100)
            : 0,
        highestScore: Math.max(...attempts.map((a) => a.score || 0)),
        lowestScore: Math.min(
          ...attempts.filter((a) => a.score > 0).map((a) => a.score)
        ),
        questionsCount: quiz.questionsCount,
      };

      return handleSuccess(
        res,
        200,
        statistics,
        "Quiz statistics retrieved successfully"
      );
    } catch (error) {
      devLog(`Get quiz statistics error: ${error.message}`);
      return handleError(res, 500, "Failed to retrieve quiz statistics", error);
    }
  }

  // Create program with exam simulator
  static async createProgramWithQuiz(req, res) {
    try {
      const { programData, examSimulator, guidedQuestions } = req.body;

      const userId = req.user.id;

      // Build program data object
      const programToCreate = {
        ...programData,
        createdBy: userId, // Add the user who created the program
      };

      // Add exam simulator if provided
      if (examSimulator) {
        programToCreate.examSimulator = examSimulator;
      }

      // Add guided questions if provided
      if (guidedQuestions) {
        programToCreate.guidedQuestions = guidedQuestions;
      }

      // Create program with exam simulator and/or guided questions
      const program = new Program(programToCreate);

      await program.save();

      devLog(`Program created: ${program._id} by user: ${userId}`);

      return handleSuccess(res, 201, program, "Program created successfully");
    } catch (error) {
      devLog(`Create program with quiz error: ${error.message}`);
      return handleError(
        res,
        500,
        "Failed to create program with exam simulator",
        error
      );
    }
  }

  // Update program exam simulator
  static async updateProgramExamSimulator(req, res) {
    try {
      const { programId } = req.params;
      const { examSimulator } = req.body;
      const userId = req.user.id;

      const program = await Program.findById(programId);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      // Update exam simulator
      program.examSimulator = {
        ...program.examSimulator,
        ...examSimulator,
      };

      await program.save();

      devLog(`Program exam simulator updated: ${programId} by user: ${userId}`);

      return handleSuccess(
        res,
        200,
        program,
        "Program exam simulator updated successfully"
      );
    } catch (error) {
      devLog(`Update program exam simulator error: ${error.message}`);
      return handleError(
        res,
        500,
        "Failed to update program exam simulator",
        error
      );
    }
  }

  // Get admin dashboard quiz statistics
  static async getDashboardQuizStats(req, res) {
    try {
      const [
        totalQuizzes,
        activeQuizzes,
        totalAttempts,
        completedAttempts,
        avgScore,
        recentQuizzes,
      ] = await Promise.all([
        Quiz.countDocuments(),
        Quiz.countDocuments({ status: "active" }),
        QuizAttempt.countDocuments(),
        QuizAttempt.countDocuments({ status: "completed" }),
        QuizAttempt.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, avgScore: { $avg: "$score" } } },
        ]),
        Quiz.find({ status: "active" })
          .populate("program", "name")
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

      const averageScore = avgScore.length > 0 ? avgScore[0].avgScore : 0;
      const completionRate =
        totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0;

      const stats = {
        totalQuizzes,
        activeQuizzes,
        totalAttempts,
        completedAttempts,
        averageScore: Math.round(averageScore * 100) / 100,
        completionRate: Math.round(completionRate),
        recentQuizzes,
      };

      return handleSuccess(
        res,
        200,
        stats,
        "Quiz dashboard statistics retrieved successfully"
      );
    } catch (error) {
      devLog(`Get dashboard quiz stats error: ${error.message}`);
      return handleError(
        res,
        500,
        "Failed to retrieve quiz dashboard statistics",
        error
      );
    }
  }
}

export default QuizController;
