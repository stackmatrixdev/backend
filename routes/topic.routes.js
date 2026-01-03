import express from "express";
import TopicController from "../controllers/topicController.js";
import authenticate from "../middleware/authenticate.js";
import { uploadCourseImage } from "../middleware/upload.js";

const router = express.Router();

// Topic CRUD
router.post(
  "/",
  authenticate,
  uploadCourseImage.single("courseImage"),
  TopicController.createTopic
);
router.get("/", authenticate, TopicController.getAllTopics);
router.get("/:id", authenticate, TopicController.getTopic);
router.put(
  "/:id",
  authenticate,
  uploadCourseImage.single("courseImage"),
  TopicController.updateTopic
);
router.delete("/:id", authenticate, TopicController.deleteTopic);

export default router;
