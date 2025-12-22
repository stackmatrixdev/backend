import Topic from "../models/Topic.model.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";

class TopicController {
  // Create a new topic
  static async createTopic(req, res) {
    try {
      const {
        title,
        description,
        category,
        numberOfFreeQuestions,
        chatbotPrice,
        documentationPrice,
        examSimulatorPrice,
        bundlePrice,
        overview,
        coverImage,
      } = req.body;

      console.log("=== CREATE TOPIC DEBUG ===");
      console.log("Request body:", req.body);

      // Validate required fields
      if (!title || !description || !category || !overview) {
        return handleError(
          res,
          400,
          "Missing required fields: title, description, category, overview"
        );
      }

      // Check if topic already exists
      const existingTopic = await Topic.findOne({ title });
      if (existingTopic) {
        return handleError(
          res,
          400,
          `A topic with title "${title}" already exists`
        );
      }

      // Create topic data
      const topicData = {
        title,
        description,
        category,
        numberOfFreeQuestions: numberOfFreeQuestions || 3,
        pricing: {
          chatbotPrice: chatbotPrice || 0,
          documentationPrice: documentationPrice || 0,
          examSimulatorPrice: examSimulatorPrice || 0,
          bundlePrice: bundlePrice || 0,
          currency: "CAD",
        },
        overview,
        coverImage: coverImage || null,
        createdBy: req.user.id,
        status: "draft",
      };

      const newTopic = new Topic(topicData);
      await newTopic.save();

      console.log("Topic created successfully:", newTopic._id);

      return handleSuccess(res, 201, newTopic, "Topic created successfully");
    } catch (error) {
      console.error("Create topic error:", error);
      if (error.code === 11000) {
        return handleError(res, 400, "A topic with this title already exists");
      }
      return handleError(res, 500, "Failed to create topic", error);
    }
  }

  // Get all topics
  static async getAllTopics(req, res) {
    try {
      const { category, status, search, isActive } = req.query;
      const filter = {};

      if (category) filter.category = category;
      if (status) filter.status = status;
      if (isActive !== undefined) filter.isActive = isActive === "true";
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      const topics = await Topic.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

      return handleSuccess(res, 200, topics, `Found ${topics.length} topics`);
    } catch (error) {
      console.error("Get all topics error:", error);
      return handleError(res, 500, "Failed to retrieve topics", error);
    }
  }

  // Get single topic
  static async getTopic(req, res) {
    try {
      const { id } = req.params;

      const topic = await Topic.findById(id).populate(
        "createdBy",
        "name email"
      );

      if (!topic) {
        return handleError(res, 404, "Topic not found");
      }

      return handleSuccess(res, 200, topic, "Topic retrieved successfully");
    } catch (error) {
      console.error("Get topic error:", error);
      return handleError(res, 500, "Failed to retrieve topic", error);
    }
  }

  // Update topic
  static async updateTopic(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const topic = await Topic.findById(id);
      if (!topic) {
        return handleError(res, 404, "Topic not found");
      }

      // Check ownership
      const requesterId = req.user?.id || null;
      const requesterRole = req.user?.role || "user";

      // Claim topic if no owner
      if (!topic.createdBy && requesterId) {
        topic.createdBy = requesterId;
        await topic.save();
        console.log(`Topic ${id} claimed by user ${requesterId}`);
      }

      const ownerId = topic.createdBy ? String(topic.createdBy) : null;

      if (ownerId && ownerId !== requesterId && requesterRole !== "admin") {
        return handleError(res, 403, "Not authorized to update this topic");
      }

      // Whitelist updatable fields
      const allowedKeys = [
        "title",
        "description",
        "category",
        "numberOfFreeQuestions",
        "overview",
        "coverImage",
        "status",
        "isActive",
      ];

      allowedKeys.forEach((key) => {
        if (updates[key] !== undefined) {
          topic[key] = updates[key];
        }
      });

      // Update pricing if provided
      if (updates.chatbotPrice !== undefined)
        topic.pricing.chatbotPrice = updates.chatbotPrice;
      if (updates.documentationPrice !== undefined)
        topic.pricing.documentationPrice = updates.documentationPrice;
      if (updates.examSimulatorPrice !== undefined)
        topic.pricing.examSimulatorPrice = updates.examSimulatorPrice;
      if (updates.bundlePrice !== undefined)
        topic.pricing.bundlePrice = updates.bundlePrice;

      await topic.save();

      return handleSuccess(res, 200, topic, "Topic updated successfully");
    } catch (error) {
      console.error("Update topic error:", error);
      return handleError(res, 500, "Failed to update topic", error);
    }
  }

  // Delete topic
  static async deleteTopic(req, res) {
    try {
      const { id } = req.params;

      const topic = await Topic.findById(id);
      if (!topic) {
        return handleError(res, 404, "Topic not found");
      }

      // Check ownership
      const requesterId = req.user?.id || null;
      const requesterRole = req.user?.role || "user";
      const ownerId = topic.createdBy ? String(topic.createdBy) : null;

      if (!ownerId) {
        if (requesterRole !== "admin") {
          return handleError(res, 403, "Not authorized to delete this topic");
        }
      } else {
        if (ownerId !== requesterId && requesterRole !== "admin") {
          return handleError(res, 403, "Not authorized to delete this topic");
        }
      }

      await topic.deleteOne();

      return handleSuccess(res, 200, null, "Topic deleted successfully");
    } catch (error) {
      console.error("Delete topic error:", error);
      return handleError(res, 500, "Failed to delete topic", error);
    }
  }
}

export default TopicController;
