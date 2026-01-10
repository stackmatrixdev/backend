import express from "express";
import PaymentController from "../controllers/paymentController.js";
import authenticate, {
  optionalAuthenticate,
} from "../middleware/authenticate.js";

const router = express.Router();

// Create checkout session (requires auth)
router.post(
  "/create-checkout-session",
  authenticate,
  PaymentController.createCheckoutSession
);

// Verify payment after redirect (requires auth)
router.get("/verify-payment", authenticate, PaymentController.verifyPayment);

// Check if user has access to a course (optional auth)
router.get(
  "/check-access/:programId",
  optionalAuthenticate,
  PaymentController.checkAccess
);

// Get user's purchases (requires auth)
router.get("/my-purchases", authenticate, PaymentController.getMyPurchases);

// Get course pricing (public)
router.get("/pricing/:programId", PaymentController.getCoursePricing);

export default router;
