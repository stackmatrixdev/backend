import express from "express";
import QuizAttemptController from "../controllers/quizAttemptController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Quiz attempt routes
router.post("/start/:programId", authenticate, QuizAttemptController.startQuiz);
router.post(
  "/:attemptId/submit",
  authenticate,
  QuizAttemptController.submitQuiz
);
router.get("/user", authenticate, QuizAttemptController.getUserAttempts);
router.get("/:attemptId", authenticate, QuizAttemptController.getQuizResult);
router.post(
  "/:attemptId/abandon",
  authenticate,
  QuizAttemptController.abandonQuiz
);

export default router;
