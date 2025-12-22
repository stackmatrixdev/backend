import express from "express";
import ProgramController from "../controllers/programController.js";
import authenticate from "../middleware/authenticate.js";
import authorizeAdmin from "../middleware/authorizeAdmin.js";

const router = express.Router();

// Public routes
router.get("/", ProgramController.getAllPrograms);
router.get("/search", ProgramController.getAllPrograms); // Same as getAllPrograms with filters
router.get("/:id", ProgramController.getProgram);
router.get("/:id/preview", ProgramController.getProgramPreview);

// Protected routes (authenticated users)
router.post("/:id/enroll", authenticate, ProgramController.enrollInProgram);

// Admin/Instructor routes
router.post("/", authenticate, ProgramController.createProgram);
router.put("/:id", authenticate, ProgramController.updateProgram);
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  ProgramController.deleteProgram
);

export default router;
