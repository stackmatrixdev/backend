import express from "express";
import AIChatController from "../controllers/aiChatController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// AI Chat routes
router.post("/session", authenticate, AIChatController.createSession);
router.get("/sessions", authenticate, AIChatController.getUserSessions);
router.get("/session/:sessionId", authenticate, AIChatController.getSession);
router.post("/message", authenticate, AIChatController.sendMessage);
router.put("/session/:sessionId", authenticate, AIChatController.updateSession);
router.delete(
  "/session/:sessionId",
  authenticate,
  AIChatController.deleteSession
);
router.post(
  "/session/:sessionId/feedback",
  authenticate,
  AIChatController.submitFeedback
);

export default router;
