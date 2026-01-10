import express from "express";
import ProgramController from "../controllers/programController.js";
import authenticate, {
  optionalAuthenticate,
} from "../middleware/authenticate.js";
import authorizeAdmin from "../middleware/authorizeAdmin.js";
import {
  uploadDocument,
  optionalDocumentUpload,
} from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", ProgramController.getAllPrograms);
router.get("/categories", ProgramController.getCategories); // Get available categories
router.get("/search", ProgramController.getAllPrograms); // Same as getAllPrograms with filters
router.get("/:id", ProgramController.getProgram);
router.get("/:id/preview", ProgramController.getProgramPreview);
router.get("/:id/pricing", ProgramController.getProgramPricing); // Get pricing info

// Protected routes (authenticated users)
router.post("/:id/enroll", authenticate, ProgramController.enrollInProgram);

// Document routes
router.get(
  "/:id/documents",
  optionalAuthenticate,
  ProgramController.getProgramDocuments
);
router.post(
  "/:id/documents",
  authenticate,
  optionalDocumentUpload, // Use optional upload middleware that allows requests without files
  ProgramController.addDocument
);
router.delete(
  "/:id/documents/:documentId",
  authenticate,
  ProgramController.deleteDocument
);

// Admin/Instructor routes
router.post("/", authenticate, ProgramController.createProgram);
router.post(
  "/categories",
  authenticate,
  authorizeAdmin,
  ProgramController.addCategory
); // Add new category (admin only)
router.put("/:id", authenticate, ProgramController.updateProgram);
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  ProgramController.deleteProgram
);

export default router;
