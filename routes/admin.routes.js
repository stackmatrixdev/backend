import express from "express";
import AdminController from "../controllers/adminController.js";
import authenticate from "../middleware/authenticate.js";
import authorizeAdmin from "../middleware/authorizeAdmin.js";

const router = express.Router();

// Get dashboard statistics
router.get(
  "/dashboard/stats",
  authenticate,
  authorizeAdmin,
  AdminController.getDashboardStats
);

// Get all users with filtering
router.get("/users", authenticate, authorizeAdmin, AdminController.getAllUsers);

// Get all quiz attempts with filtering
router.get(
  "/attempts",
  authenticate,
  authorizeAdmin,
  AdminController.getAllQuizAttempts
);

// Update program status
router.put(
  "/programs/:programId/status",
  authenticate,
  authorizeAdmin,
  AdminController.updateProgramStatus
);

// Delete program
router.delete(
  "/programs/:programId",
  authenticate,
  authorizeAdmin,
  AdminController.deleteProgram
);

// Get analytics data
router.get(
  "/analytics",
  authenticate,
  authorizeAdmin,
  AdminController.getAnalytics
);

// Bulk update programs
router.put(
  "/programs/bulk",
  authenticate,
  authorizeAdmin,
  AdminController.bulkUpdatePrograms
);

export default router;
