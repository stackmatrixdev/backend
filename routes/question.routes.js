import express from "express";
import QuestionController from "../controllers/questionController.js";
import authenticate from "../middleware/authenticate.js";
import authorizeAdmin from "../middleware/authorizeAdmin.js";

const router = express.Router();

// Get all questions (with filtering)
router.get("/", authenticate, QuestionController.getAllQuestions);

// Get question bank (questions not assigned to any quiz)
router.get(
  "/bank",
  authenticate,
  authorizeAdmin,
  QuestionController.getQuestionBank
);

// Get question by ID
router.get("/:id", authenticate, QuestionController.getQuestionById);

// Create new question
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  QuestionController.createQuestion
);

// Bulk create questions
router.post(
  "/bulk",
  authenticate,
  authorizeAdmin,
  QuestionController.bulkCreateQuestions
);

// Update question
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  QuestionController.updateQuestion
);

// Delete question
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  QuestionController.deleteQuestion
);

// Bulk delete questions
router.delete(
  "/bulk",
  authenticate,
  authorizeAdmin,
  QuestionController.bulkDeleteQuestions
);

// Get questions by quiz
router.get(
  "/quiz/:quizId",
  authenticate,
  QuestionController.getQuestionsByQuiz
);

// Add questions to quiz from question bank
router.post(
  "/quiz/:quizId/add-questions",
  authenticate,
  authorizeAdmin,
  QuestionController.addQuestionsToQuiz
);

export default router;
