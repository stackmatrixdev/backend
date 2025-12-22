import express from "express";
import TopicController from "../controllers/topicController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Topic CRUD
router.post("/", authenticate, TopicController.createTopic);
router.get("/", authenticate, TopicController.getAllTopics);
router.get("/:id", authenticate, TopicController.getTopic);
router.put("/:id", authenticate, TopicController.updateTopic);
router.delete("/:id", authenticate, TopicController.deleteTopic);

export default router;
