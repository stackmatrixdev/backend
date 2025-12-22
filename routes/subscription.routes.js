import express from "express";
import SubscriptionController from "../controllers/subscriptionController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Get all available subscription plans (public)
router.get("/plans", SubscriptionController.getPlans);

// Get user's current subscription (protected)
router.get("/user", authenticate, SubscriptionController.getUserSubscription);

// Create new subscription (protected)
router.post("/create", authenticate, SubscriptionController.createSubscription);

export default router;
