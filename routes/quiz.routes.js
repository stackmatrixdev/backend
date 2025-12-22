import express from "express";
import QuizController from "../controllers/quizController.js";
import authenticate from "../middleware/authenticate.js";
import authorizeAdmin from "../middleware/authorizeAdmin.js";

const router = express.Router();

// Get all quizzes (with filtering)
router.get("/", authenticate, QuizController.getAllQuizzes);

// Get quiz by ID
router.get("/:id", authenticate, QuizController.getQuizById);

// Create new quiz (admin/instructor only)
router.post("/", authenticate, authorizeAdmin, QuizController.createQuiz);

// Update quiz (admin/instructor only)
router.put("/:id", authenticate, authorizeAdmin, QuizController.updateQuiz);

// Delete quiz (admin only)
router.delete("/:id", authenticate, authorizeAdmin, QuizController.deleteQuiz);

// Get quizzes by program
router.get("/program/:programId", QuizController.getQuizzesByProgram);

// Get quiz statistics
router.get("/:id/statistics", authenticate, authorizeAdmin, QuizController.getQuizStatistics);

// Create program with exam simulator
router.post("/program-with-quiz", authenticate, authorizeAdmin, QuizController.createProgramWithQuiz);

// Update program exam simulator
router.put("/program/:programId/exam-simulator", authenticate, authorizeAdmin, QuizController.updateProgramExamSimulator);

// Get dashboard quiz statistics for admin
router.get("/admin/dashboard-stats", authenticate, authorizeAdmin, QuizController.getDashboardQuizStats);

export default router;
