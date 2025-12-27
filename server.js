import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { startForgotPasswordExpiryCleaner } from "./utils/expiredFlagsCleaner.js";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import programRoutes from "./routes/program.routes.js";
import questionRoutes from "./routes/question.routes.js";
import attemptRoutes from "./routes/attempt.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import aiChatRoutes from "./routes/aiChat.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import topicRoutes from "./routes/topic.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import fileRoutes from "./routes/file.routes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");

    // One-time migration: Drop the unique index on program name
    try {
      await mongoose.connection.db.collection("programs").dropIndex("name_1");
      console.log("✅ Dropped unique index on program name");
    } catch (error) {
      if (error.code === 27 || error.message.includes("index not found")) {
        console.log(
          "ℹ️ Unique index on program name already removed or does not exist"
        );
      } else {
        console.log("⚠️ Note: Could not drop index:", error.message);
      }
    }
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// after DB connection succeeds:
startForgotPasswordExpiryCleaner(); // runs every 60s by default

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/ai-chat", aiChatRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/files", fileRoutes);

// Ck server running
app.get("/", (req, res) => {
  res.send("LearninGPT Server is running");
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "LearninGPT API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});

export default app;
