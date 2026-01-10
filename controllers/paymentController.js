import Stripe from "stripe";
import CoursePurchase from "../models/CoursePurchase.model.js";
import Program from "../models/Program.model.js";
import User from "../models/User.model.js";
import { handleSuccess, handleError } from "../utils/handleResponse.js";

// Lazily initialize Stripe with secret key to avoid running before dotenv loads
let _stripe = null;
function getStripe() {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error(
      "❌ [Payment] STRIPE_SECRET_KEY is not set. Make sure .env is loaded before importing paymentController."
    );
    // Do not throw here to avoid crashing the app during import; methods will surface errors when used.
  }
  _stripe = new Stripe(key);
  console.log("🔐 [Payment] Stripe initialized");
  return _stripe;
}

class PaymentController {
  /**
   * Stripe webhook handler (expects raw body)
   * POST /api/payments/webhook
   */
  static async handleWebhook(req, res) {
    try {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.warn(
          "⚠️ [Payment] STRIPE_WEBHOOK_SECRET not set. Webhook signature will not be verified."
        );
      }

      const stripe = getStripe();

      let event;
      try {
        // req.body is raw buffer because server.js registers express.raw for this route
        event = webhookSecret
          ? stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
          : req.body; // when no secret, assume body is already parsed (dev only)
      } catch (err) {
        console.error(
          "❌ [Payment] Webhook signature verification failed:",
          err.message
        );
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      console.log("📩 [Payment] Webhook received:", event.type);

      // Handle the event types we care about
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          console.log("✅ [Payment] Checkout session completed:", session.id);
          // Optionally, you can create/update CoursePurchase here using session.metadata
          break;
        }
        case "payment_intent.succeeded": {
          const intent = event.data.object;
          console.log("✅ [Payment] PaymentIntent succeeded:", intent.id);
          break;
        }
        default:
          console.log(`ℹ️ [Payment] Unhandled event type ${event.type}`);
      }

      // Return a 200 to acknowledge receipt of the event
      res.json({ received: true });
    } catch (error) {
      console.error("❌ [Payment] Webhook handler error:", error);
      res.status(500).send();
    }
  }

  /**
   * Create a Stripe Checkout Session for course purchase
   * POST /api/payments/create-checkout-session
   */
  static async createCheckoutSession(req, res) {
    try {
      const { programId, accessType = "documentation" } = req.body;
      const userId = req.user.id;

      console.log("💳 [Payment] Creating checkout session...");
      console.log("   User ID:", userId);
      console.log("   Program ID:", programId);
      console.log("   Access Type:", accessType);

      // Validate program exists
      const program = await Program.findById(programId);
      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      // Check if user already has access
      const existingPurchase = await CoursePurchase.hasAccess(
        userId,
        programId,
        accessType
      );
      if (existingPurchase) {
        return handleError(res, 400, "You already have access to this course");
      }

      // Get price based on access type
      let price = 0;
      let productName = "";

      switch (accessType) {
        case "documentation":
          price = program.pricing?.documentationPrice || 19.99;
          productName = `${program.title} - Documentation Access`;
          break;
        case "ai_coach":
          price = program.pricing?.aiCoachPrice || 19.99;
          productName = `${program.title} - AI Coach Access`;
          break;
        case "exam_simulator":
          price = program.pricing?.examSimulatorPrice || 19.99;
          productName = `${program.title} - Exam Simulator Access`;
          break;
        case "full_access":
          price =
            program.pricing?.fullAccessPrice || program.pricing?.price || 29.99;
          productName = `${program.title} - Full Access (Lifetime)`;
          break;
        default:
          price = program.pricing?.price || 29.99;
          productName = `${program.title} - Course Access`;
      }

      console.log("   Price:", price);
      console.log("   Product:", productName);

      // Create Stripe Checkout Session
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment", // One-time payment
        customer_email: req.user.email,
        line_items: [
          {
            price_data: {
              currency: "cad",
              product_data: {
                name: productName,
                description: `Lifetime access to ${program.title}`,
                images: program.thumbnail ? [program.thumbnail] : [],
              },
              unit_amount: Math.round(price * 100), // Stripe uses cents
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: userId.toString(),
          programId: programId.toString(),
          accessType: accessType,
          programTitle: program.title,
        },
        success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.STRIPE_CANCEL_URL}?program_id=${programId}`,
      });

      console.log("✅ [Payment] Checkout session created:", session.id);

      return handleSuccess(
        res,
        200,
        {
          sessionId: session.id,
          url: session.url,
        },
        "Checkout session created successfully"
      );
    } catch (error) {
      console.error("❌ [Payment] Create checkout error:", error);
      return handleError(res, 500, "Failed to create checkout session", error);
    }
  }

  /**
   * Verify payment and grant access
   * GET /api/payments/verify-payment
   */
  static async verifyPayment(req, res) {
    try {
      const { sessionId } = req.query;
      const userId = req.user.id;

      console.log("🔍 [Payment] Verifying payment...");
      console.log("   Session ID:", sessionId);

      if (!sessionId) {
        return handleError(res, 400, "Session ID is required");
      }

      // Retrieve the session from Stripe
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid") {
        return handleError(res, 400, "Payment not completed");
      }

      // Extract metadata
      const { programId, accessType } = session.metadata;

      // Check if purchase already recorded
      const existingPurchase = await CoursePurchase.findOne({
        sessionId: sessionId,
        status: "completed",
      });

      if (existingPurchase) {
        console.log("ℹ️ [Payment] Purchase already recorded");
        return handleSuccess(
          res,
          200,
          { purchase: existingPurchase },
          "Purchase already confirmed"
        );
      }

      // Create or update purchase record
      const purchase = await CoursePurchase.findOneAndUpdate(
        {
          user: userId,
          program: programId,
          accessType: accessType,
        },
        {
          paymentId: session.payment_intent,
          sessionId: sessionId,
          amount: session.amount_total / 100,
          currency: session.currency.toUpperCase(),
          status: "completed",
          purchasedAt: new Date(),
        },
        {
          upsert: true,
          new: true,
        }
      );

      console.log("✅ [Payment] Purchase recorded:", purchase._id);

      // Update user's enrolled programs
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          enrolledPrograms: {
            program: programId,
            enrolledAt: new Date(),
            accessType: accessType,
          },
        },
      });

      return handleSuccess(
        res,
        200,
        {
          purchase: purchase,
          programId: programId,
          accessType: accessType,
        },
        "Payment verified and access granted!"
      );
    } catch (error) {
      console.error("❌ [Payment] Verify payment error:", error);
      return handleError(res, 500, "Failed to verify payment", error);
    }
  }

  /**
   * Check if user has access to a course
   * GET /api/payments/check-access/:programId
   */
  static async checkAccess(req, res) {
    try {
      const { programId } = req.params;
      const { accessType = "documentation" } = req.query;
      const userId = req.user?.id;

      // If no user, return no access
      if (!userId) {
        return handleSuccess(res, 200, {
          hasAccess: false,
          reason: "not_logged_in",
        });
      }

      // Check for existing purchase
      const hasAccess = await CoursePurchase.hasAccess(
        userId,
        programId,
        accessType
      );

      // Also check if program is free
      const program = await Program.findById(programId).select("pricing");
      const isProgramFree = program?.pricing?.isFree;

      return handleSuccess(res, 200, {
        hasAccess: hasAccess || isProgramFree,
        isProgramFree: isProgramFree,
        reason: hasAccess
          ? "purchased"
          : isProgramFree
          ? "free_program"
          : "not_purchased",
      });
    } catch (error) {
      console.error("❌ [Payment] Check access error:", error);
      return handleError(res, 500, "Failed to check access", error);
    }
  }

  /**
   * Get user's purchases
   * GET /api/payments/my-purchases
   */
  static async getMyPurchases(req, res) {
    try {
      const userId = req.user.id;

      const purchases = await CoursePurchase.getUserPurchases(userId);

      return handleSuccess(
        res,
        200,
        purchases,
        "Purchases retrieved successfully"
      );
    } catch (error) {
      console.error("❌ [Payment] Get purchases error:", error);
      return handleError(res, 500, "Failed to get purchases", error);
    }
  }

  /**
   * Get course pricing
   * GET /api/payments/pricing/:programId
   */
  static async getCoursePricing(req, res) {
    try {
      const { programId } = req.params;

      const program = await Program.findById(programId).select(
        "title pricing thumbnail"
      );

      if (!program) {
        return handleError(res, 404, "Program not found");
      }

      const pricing = {
        programId: program._id,
        programTitle: program.title,
        thumbnail: program.thumbnail,
        isFree: program.pricing?.isFree || false,
        currency: "CAD",
        options: [
          {
            accessType: "documentation",
            name: "Documentation Only",
            description:
              "Access to all course materials, PDFs, and study guides",
            price: program.pricing?.documentationPrice || 19.99,
            features: ["PDF Documents", "Study Materials", "Lifetime Access"],
          },
          {
            accessType: "ai_coach",
            name: "AI Coach Only",
            description: "Personal AI tutor for guided learning",
            price: program.pricing?.aiCoachPrice || 19.99,
            features: [
              "AI Chat Support",
              "Personalized Guidance",
              "Unlimited Questions",
            ],
          },
          {
            accessType: "exam_simulator",
            name: "Exam Simulator Only",
            description: "Practice with mock exams and quizzes",
            price: program.pricing?.examSimulatorPrice || 19.99,
            features: [
              "Mock Exams",
              "Practice Quizzes",
              "Performance Analytics",
            ],
          },
          {
            accessType: "full_access",
            name: "Full Access (Best Value)",
            description: "Complete access to everything",
            price:
              program.pricing?.fullAccessPrice ||
              program.pricing?.price ||
              29.99,
            features: [
              "All Documentation",
              "AI Coach",
              "Exam Simulator",
              "Certificate",
              "Lifetime Access",
            ],
            popular: true,
          },
        ],
      };

      return handleSuccess(res, 200, pricing, "Pricing retrieved successfully");
    } catch (error) {
      console.error("❌ [Payment] Get pricing error:", error);
      return handleError(res, 500, "Failed to get pricing", error);
    }
  }
}

export default PaymentController;
