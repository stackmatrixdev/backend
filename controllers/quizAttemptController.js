import QuizAttempt from "../models/QuizAttempt.model.js";
import Program from "../models/Program.model.js";
import User from "../models/User.model.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";
import { devLog } from "../utils/helper.js";

class QuizAttemptController {
  // Start a quiz (get questions without answers)
  static async startQuiz(req, res) {
    try {
      const userId = req.user.id;
      const { programId } = req.params;

      // Find program with quiz
      const program = await Program.findById(programId);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      if (!program.examSimulator || !program.examSimulator.enabled) {
        return handleError(res, 400, "Quiz is not available for this program");
      }

      // Check if user has attempts remaining
      const existingAttempts = await QuizAttempt.countDocuments({
        userId,
        programId,
        status: { $in: ["completed", "submitted"] },
      });

      const maxAttempts = program.examSimulator.maxAttempts || 3;
      if (existingAttempts >= maxAttempts) {
        return handleError(
          res,
          403,
          `Maximum attempts (${maxAttempts}) reached for this quiz`
        );
      }

      // Create new attempt
      const attempt = new QuizAttempt({
        userId,
        programId,
        timeAllocated: program.examSimulator.timeLimit || 30, // minutes
        totalMarks: program.examSimulator.totalMarks || 100,
        status: "in-progress",
        startedAt: new Date(),
      });

      await attempt.save();

      // Format questions without correct answers
      const questions = program.examSimulator.questions.map((q, index) => ({
        questionNumber: index + 1,
        questionId: q._id,
        type: q.type,
        questionText: q.questionText,
        mark: q.mark,
        skillLevel: q.skillLevel,
        options: q.options || [],
        // Don't include correctAnswers or explanation
      }));

      // Shuffle questions if enabled
      const shuffledQuestions = program.settings?.shuffleQuestions
        ? shuffleArray(questions)
        : questions;

      devLog(
        `Quiz started for user: ${userId}, program: ${programId}, attempt: ${attempt._id}`
      );

      return handleSuccess(
        res,
        200,
        {
          attemptId: attempt._id,
          programName: program.name,
          programId: program._id,
          timeLimit: attempt.timeAllocated,
          totalMarks: attempt.totalMarks,
          totalQuestions: questions.length,
          questions: shuffledQuestions,
          attemptsUsed: existingAttempts + 1,
          maxAttempts,
        },
        "Quiz started successfully"
      );
    } catch (error) {
      devLog(`Start quiz error: ${error.message}`);
      return handleError(res, 500, "Failed to start quiz", error);
    }
  }

  // Submit quiz answers
  static async submitQuiz(req, res) {
    try {
      const userId = req.user.id;
      const { attemptId } = req.params;
      const { answers, timeTaken } = req.body; // answers: [{questionId, selectedAnswers: []}]

      // Find attempt
      const attempt = await QuizAttempt.findOne({
        _id: attemptId,
        userId,
        status: "in-progress",
      });

      if (!attempt) {
        return handleError(
          res,
          404,
          "Quiz attempt not found or already submitted"
        );
      }

      // Get program with correct answers
      const program = await Program.findById(attempt.programId);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      // Calculate score
      let totalScore = 0;
      let correctAnswers = 0;
      let incorrectAnswers = 0;
      let skippedAnswers = 0;

      const questionResults = [];

      program.examSimulator.questions.forEach((question, index) => {
        const userAnswer = answers.find(
          (a) => a.questionId.toString() === question._id.toString()
        );
        const isCorrect = checkAnswer(
          question,
          userAnswer?.selectedAnswers || []
        );

        const result = {
          questionId: question._id,
          questionNumber: index + 1,
          questionText: question.questionText,
          userAnswers: userAnswer?.selectedAnswers || [],
          correctAnswers: question.correctAnswers,
          isCorrect,
          marks: isCorrect ? question.mark : 0,
          explanation: question.explanation,
        };

        questionResults.push(result);

        if (userAnswer?.selectedAnswers?.length === 0) {
          skippedAnswers++;
        } else if (isCorrect) {
          correctAnswers++;
          totalScore += question.mark;
        } else {
          incorrectAnswers++;
        }
      });

      const percentage = Math.round((totalScore / attempt.totalMarks) * 100);
      const passed = percentage >= 70; // 70% passing grade

      // Update attempt
      attempt.answers = answers;
      attempt.score = totalScore;
      attempt.percentage = percentage;
      attempt.correctAnswers = correctAnswers;
      attempt.incorrectAnswers = incorrectAnswers;
      attempt.skippedAnswers = skippedAnswers;
      attempt.timeTaken = timeTaken || attempt.timeAllocated;
      attempt.passed = passed;
      attempt.status = "completed";
      attempt.submittedAt = new Date();

      await attempt.save();

      // Update user stats
      await updateUserStats(userId, {
        totalScore,
        totalMarks: attempt.totalMarks,
        percentage,
        passed,
        programId: attempt.programId,
        programName: program.name,
      });

      devLog(
        `Quiz submitted for user: ${userId}, attempt: ${attemptId}, score: ${totalScore}/${attempt.totalMarks}`
      );

      return handleSuccess(
        res,
        200,
        {
          attemptId: attempt._id,
          score: totalScore,
          totalMarks: attempt.totalMarks,
          percentage,
          passed,
          correctAnswers,
          incorrectAnswers,
          skippedAnswers,
          timeTaken: attempt.timeTaken,
          questionResults, // Include detailed results
        },
        "Quiz submitted successfully"
      );
    } catch (error) {
      devLog(`Submit quiz error: ${error.message}`);
      return handleError(res, 500, "Failed to submit quiz", error);
    }
  }

  // Get quiz result
  static async getQuizResult(req, res) {
    try {
      const userId = req.user.id;
      const { attemptId } = req.params;

      const attempt = await QuizAttempt.findOne({
        _id: attemptId,
        userId,
        status: "completed",
      }).populate("programId", "name topic category");

      if (!attempt) {
        return handleError(res, 404, "Quiz result not found");
      }

      // Get program for detailed results
      const program = await Program.findById(attempt.programId);
      const questionResults = [];

      if (program && program.examSimulator) {
        program.examSimulator.questions.forEach((question, index) => {
          const userAnswer = attempt.answers.find(
            (a) => a.questionId.toString() === question._id.toString()
          );

          questionResults.push({
            questionNumber: index + 1,
            questionText: question.questionText,
            userAnswers: userAnswer?.selectedAnswers || [],
            correctAnswers: question.correctAnswers,
            isCorrect: checkAnswer(question, userAnswer?.selectedAnswers || []),
            explanation: question.explanation,
            marks: checkAnswer(question, userAnswer?.selectedAnswers || [])
              ? question.mark
              : 0,
          });
        });
      }

      return handleSuccess(
        res,
        200,
        {
          attemptId: attempt._id,
          program: {
            id: attempt.programId._id,
            name: attempt.programId.name,
            topic: attempt.programId.topic,
            category: attempt.programId.category,
          },
          score: attempt.score,
          totalMarks: attempt.totalMarks,
          percentage: attempt.percentage,
          passed: attempt.passed,
          correctAnswers: attempt.correctAnswers,
          incorrectAnswers: attempt.incorrectAnswers,
          skippedAnswers: attempt.skippedAnswers,
          timeTaken: attempt.timeTaken,
          timeAllocated: attempt.timeAllocated,
          submittedAt: attempt.submittedAt,
          questionResults,
        },
        "Quiz result retrieved successfully"
      );
    } catch (error) {
      devLog(`Get quiz result error: ${error.message}`);
      return handleError(res, 500, "Failed to get quiz result", error);
    }
  }

  // Get user's quiz attempts history
  static async getUserAttempts(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status, programId } = req.query;

      const filter = { userId };
      if (status) filter.status = status;
      if (programId) filter.programId = programId;

      const attempts = await QuizAttempt.find(filter)
        .populate("programId", "name topic category")
        .sort({ submittedAt: -1, startedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const totalAttempts = await QuizAttempt.countDocuments(filter);

      const formattedAttempts = attempts.map((attempt) => ({
        attemptId: attempt._id,
        program: {
          id: attempt.programId._id,
          name: attempt.programId.name,
          topic: attempt.programId.topic,
          category: attempt.programId.category,
        },
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        percentage: attempt.percentage,
        passed: attempt.passed,
        status: attempt.status,
        timeTaken: attempt.timeTaken,
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
        "User quiz attempts retrieved successfully"
      );
    } catch (error) {
      devLog(`Get user attempts error: ${error.message}`);
      return handleError(res, 500, "Failed to get quiz attempts", error);
    }
  }

  // Abandon/cancel quiz
  static async abandonQuiz(req, res) {
    try {
      const userId = req.user.id;
      const { attemptId } = req.params;

      const attempt = await QuizAttempt.findOneAndUpdate(
        {
          _id: attemptId,
          userId,
          status: "in-progress",
        },
        {
          status: "abandoned",
          abandonedAt: new Date(),
        },
        { new: true }
      );

      if (!attempt) {
        return handleError(
          res,
          404,
          "Quiz attempt not found or already completed"
        );
      }

      devLog(`Quiz abandoned by user: ${userId}, attempt: ${attemptId}`);

      return handleSuccess(
        res,
        200,
        {
          attemptId: attempt._id,
          status: attempt.status,
          abandonedAt: attempt.abandonedAt,
        },
        "Quiz abandoned successfully"
      );
    } catch (error) {
      devLog(`Abandon quiz error: ${error.message}`);
      return handleError(res, 500, "Failed to abandon quiz", error);
    }
  }
}

// Helper functions
function checkAnswer(question, userAnswers) {
  if (!userAnswers || userAnswers.length === 0) return false;

  const correctAnswers = question.correctAnswers || [];

  if (question.type === "single-choice") {
    return userAnswers.length === 1 && correctAnswers.includes(userAnswers[0]);
  } else if (question.type === "multi-choice") {
    // Must select all correct answers and no incorrect ones
    return (
      userAnswers.length === correctAnswers.length &&
      userAnswers.every((ans) => correctAnswers.includes(ans)) &&
      correctAnswers.every((ans) => userAnswers.includes(ans))
    );
  } else if (question.type === "text" || question.type === "fill-in-gap") {
    // Case-insensitive text comparison
    const userText = userAnswers[0]?.toLowerCase().trim() || "";
    return correctAnswers.some(
      (correct) => correct.toLowerCase().trim() === userText
    );
  }

  return false;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function updateUserStats(userId, quizData) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Update quiz statistics
    user.stats.quizzesCompleted += 1;
    user.stats.totalQuizzes = Math.max(
      user.stats.totalQuizzes,
      user.stats.quizzesCompleted
    );

    // Update average score
    user.updateAverageScore(quizData.percentage);

    // Add recent quiz result
    user.addQuizResult({
      programId: quizData.programId,
      title: quizData.programName,
      score: quizData.totalScore,
      totalMarks: quizData.totalMarks,
      percentage: quizData.percentage,
    });

    // Add achievement if passed
    if (quizData.passed) {
      user.addAchievement({
        title: "Quiz Completed",
        description: `Successfully completed ${quizData.programName}`,
        category: "quiz",
        icon: "🎯",
      });
    }

    await user.save();
  } catch (error) {
    devLog(`Update user stats error: ${error.message}`);
  }
}

export default QuizAttemptController;
