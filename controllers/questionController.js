import Question from "../models/Question.model.js";
import Quiz from "../models/Quiz.model.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";
import { devLog } from "../utils/helper.js";

class QuestionController {
  // Get all questions with filtering
  static async getAllQuestions(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        difficulty,
        quiz,
        topic,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const query = {};

      // Apply filters
      if (type) query.type = type;
      if (difficulty) query.difficulty = difficulty;
      if (quiz) query.quiz = quiz;
      if (topic) query.topic = topic;

      // Search functionality
      if (search) {
        query.$or = [
          { question: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
        populate: [
          { path: "quiz", select: "title type" },
          { path: "createdBy", select: "fullname email" },
        ],
      };

      const questions = await Question.paginate(query, options);

      return handleSuccess(
        res,
        200,
        {
          questions: questions.docs,
          totalQuestions: questions.totalDocs,
          totalPages: questions.totalPages,
          currentPage: questions.page,
          hasNextPage: questions.hasNextPage,
          hasPrevPage: questions.hasPrevPage,
        },
        "Questions retrieved successfully"
      );
    } catch (error) {
      devLog(`Get all questions error: ${error.message}`);
      return handleError(res, 500, "Failed to retrieve questions", error);
    }
  }

  // Get question by ID
  static async getQuestionById(req, res) {
    try {
      const { id } = req.params;

      const question = await Question.findById(id)
        .populate("quiz", "title type")
        .populate("createdBy", "fullname email");

      if (!question) {
        return handleError(res, 404, "Question not found");
      }

      return handleSuccess(
        res,
        200,
        question,
        "Question retrieved successfully"
      );
    } catch (error) {
      devLog(`Get question by ID error: ${error.message}`);
      return handleError(res, 500, "Failed to retrieve question", error);
    }
  }

  // Create new question
  static async createQuestion(req, res) {
    try {
      const {
        question,
        type,
        options,
        correctAnswer,
        explanation,
        marks,
        difficulty,
        quiz: quizId,
        topic,
        tags,
        media,
      } = req.body;

      const userId = req.user.id;

      // Validate quiz exists if provided
      if (quizId) {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
          return handleError(res, 404, "Quiz not found");
        }
      }

      // Create new question
      const newQuestion = new Question({
        question,
        type,
        options,
        correctAnswer,
        explanation,
        marks,
        difficulty,
        quiz: quizId,
        topic,
        tags,
        media,
        createdBy: userId,
      });

      await newQuestion.save();

      // If quiz provided, add question to quiz
      if (quizId) {
        await Quiz.findByIdAndUpdate(quizId, {
          $push: { questions: newQuestion._id },
        });
      }

      const populatedQuestion = await Question.findById(newQuestion._id)
        .populate("quiz", "title type")
        .populate("createdBy", "fullname email");

      devLog(`Question created: ${newQuestion._id} by user: ${userId}`);

      return handleSuccess(
        res,
        201,
        populatedQuestion,
        "Question created successfully"
      );
    } catch (error) {
      devLog(`Create question error: ${error.message}`);
      return handleError(res, 500, "Failed to create question", error);
    }
  }

  // Update question
  static async updateQuestion(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;

      const question = await Question.findById(id);
      if (!question) {
        return handleError(res, 404, "Question not found");
      }

      // Check if user has permission to update
      if (
        question.createdBy.toString() !== userId &&
        req.user.role !== "admin"
      ) {
        return handleError(res, 403, "Not authorized to update this question");
      }

      const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
        .populate("quiz", "title type")
        .populate("createdBy", "fullname email");

      devLog(`Question updated: ${id} by user: ${userId}`);

      return handleSuccess(
        res,
        200,
        updatedQuestion,
        "Question updated successfully"
      );
    } catch (error) {
      devLog(`Update question error: ${error.message}`);
      return handleError(res, 500, "Failed to update question", error);
    }
  }

  // Delete question
  static async deleteQuestion(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const question = await Question.findById(id);
      if (!question) {
        return handleError(res, 404, "Question not found");
      }

      // Check if user has permission to delete
      if (
        question.createdBy.toString() !== userId &&
        req.user.role !== "admin"
      ) {
        return handleError(res, 403, "Not authorized to delete this question");
      }

      // Remove question from quiz if associated
      if (question.quiz) {
        await Quiz.findByIdAndUpdate(question.quiz, {
          $pull: { questions: id },
        });
      }

      // Delete the question
      await Question.findByIdAndDelete(id);

      devLog(`Question deleted: ${id} by user: ${userId}`);

      return handleSuccess(res, 200, null, "Question deleted successfully");
    } catch (error) {
      devLog(`Delete question error: ${error.message}`);
      return handleError(res, 500, "Failed to delete question", error);
    }
  }

  // Bulk create questions
  static async bulkCreateQuestions(req, res) {
    try {
      const { questions, quizId } = req.body;
      const userId = req.user.id;

      // Validate quiz exists if provided
      if (quizId) {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
          return handleError(res, 404, "Quiz not found");
        }
      }

      // Create questions with user ID
      const questionsWithUserId = questions.map((q) => ({
        ...q,
        quiz: quizId,
        createdBy: userId,
      }));

      const createdQuestions = await Question.insertMany(questionsWithUserId);

      // If quiz provided, add questions to quiz
      if (quizId) {
        const questionIds = createdQuestions.map((q) => q._id);
        await Quiz.findByIdAndUpdate(quizId, {
          $push: { questions: { $each: questionIds } },
        });
      }

      devLog(
        `Bulk created ${createdQuestions.length} questions by user: ${userId}`
      );

      return handleSuccess(
        res,
        201,
        createdQuestions,
        `${createdQuestions.length} questions created successfully`
      );
    } catch (error) {
      devLog(`Bulk create questions error: ${error.message}`);
      return handleError(res, 500, "Failed to create questions", error);
    }
  }

  // Bulk delete questions
  static async bulkDeleteQuestions(req, res) {
    try {
      const { questionIds } = req.body;
      const userId = req.user.id;

      // Get questions to check ownership
      const questions = await Question.find({ _id: { $in: questionIds } });

      // Check if user has permission to delete all questions
      const unauthorizedQuestions = questions.filter(
        (q) => q.createdBy.toString() !== userId && req.user.role !== "admin"
      );

      if (unauthorizedQuestions.length > 0) {
        return handleError(res, 403, "Not authorized to delete some questions");
      }

      // Remove questions from their quizzes
      const quizIds = [
        ...new Set(questions.map((q) => q.quiz).filter(Boolean)),
      ];
      await Promise.all(
        quizIds.map((quizId) =>
          Quiz.findByIdAndUpdate(quizId, {
            $pull: { questions: { $in: questionIds } },
          })
        )
      );

      // Delete the questions
      const result = await Question.deleteMany({ _id: { $in: questionIds } });

      devLog(
        `Bulk deleted ${result.deletedCount} questions by user: ${userId}`
      );

      return handleSuccess(
        res,
        200,
        { deletedCount: result.deletedCount },
        `${result.deletedCount} questions deleted successfully`
      );
    } catch (error) {
      devLog(`Bulk delete questions error: ${error.message}`);
      return handleError(res, 500, "Failed to delete questions", error);
    }
  }

  // Get questions by quiz
  static async getQuestionsByQuiz(req, res) {
    try {
      const { quizId } = req.params;
      const { includeAnswers = false } = req.query;

      const questions = await Question.find({ quiz: quizId }).sort({
        createdAt: 1,
      });

      // If not admin and includeAnswers not requested, hide correct answers
      const isAdmin = req.user?.role === "admin";
      const shouldIncludeAnswers = isAdmin && includeAnswers === "true";

      const formattedQuestions = questions.map((q) => {
        const questionObj = q.toObject();

        if (!shouldIncludeAnswers) {
          delete questionObj.correctAnswer;
          if (questionObj.options) {
            questionObj.options = questionObj.options.map((opt) => ({
              text: opt.text,
              // Don't include isCorrect
            }));
          }
        }

        return questionObj;
      });

      return handleSuccess(
        res,
        200,
        formattedQuestions,
        "Quiz questions retrieved successfully"
      );
    } catch (error) {
      devLog(`Get questions by quiz error: ${error.message}`);
      return handleError(res, 500, "Failed to retrieve quiz questions", error);
    }
  }

  // Get question bank (all questions not assigned to a quiz)
  static async getQuestionBank(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        type,
        difficulty,
        topic,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const query = { quiz: { $exists: false } };

      // Apply filters
      if (type) query.type = type;
      if (difficulty) query.difficulty = difficulty;
      if (topic) query.topic = topic;

      // Search functionality
      if (search) {
        query.$or = [
          { question: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
        populate: [{ path: "createdBy", select: "fullname email" }],
      };

      const questions = await Question.paginate(query, options);

      return handleSuccess(
        res,
        200,
        {
          questions: questions.docs,
          totalQuestions: questions.totalDocs,
          totalPages: questions.totalPages,
          currentPage: questions.page,
        },
        "Question bank retrieved successfully"
      );
    } catch (error) {
      devLog(`Get question bank error: ${error.message}`);
      return handleError(res, 500, "Failed to retrieve question bank", error);
    }
  }

  // Add questions to quiz from question bank
  static async addQuestionsToQuiz(req, res) {
    try {
      const { quizId } = req.params;
      const { questionIds } = req.body;

      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return handleError(res, 404, "Quiz not found");
      }

      // Validate questions exist and are available
      const questions = await Question.find({
        _id: { $in: questionIds },
        quiz: { $exists: false },
      });

      if (questions.length !== questionIds.length) {
        return handleError(
          res,
          400,
          "Some questions are not available or already assigned"
        );
      }

      // Add questions to quiz
      await Quiz.findByIdAndUpdate(quizId, {
        $push: { questions: { $each: questionIds } },
      });

      // Update questions with quiz reference
      await Question.updateMany(
        { _id: { $in: questionIds } },
        { quiz: quizId }
      );

      devLog(`Added ${questionIds.length} questions to quiz: ${quizId}`);

      return handleSuccess(
        res,
        200,
        { addedCount: questionIds.length },
        `${questionIds.length} questions added to quiz successfully`
      );
    } catch (error) {
      devLog(`Add questions to quiz error: ${error.message}`);
      return handleError(res, 500, "Failed to add questions to quiz", error);
    }
  }
}

export default QuestionController;
