import express from "express";
import FileController from "../controllers/fileController.js";
import authenticate from "../middleware/authenticate.js";
import { uploadProfile, uploadDocument } from "../middleware/upload.js";

const router = express.Router();

// Upload profile picture
router.post(
  "/upload-profile",
  authenticate,
  uploadProfile.single("profile"),
  FileController.uploadProfilePicture
);

// Upload document (can be associated with a program)
router.post(
  "/upload-document/:programId?",
  authenticate,
  uploadDocument.single("document"),
  FileController.uploadProgramDocument
);

// Serve files (profiles and documents)
router.get("/profiles/:filename", FileController.serveFile);
router.get("/documents/:filename", FileController.serveFile);
router.get("/:type/:filename", FileController.serveFile);

// Get file info
router.get("/info/:fileId", authenticate, FileController.getFileInfo);

// Delete file
router.delete("/:fileId", authenticate, FileController.deleteFile);

export default router;