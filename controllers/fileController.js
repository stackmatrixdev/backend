import path from "path";
import fs from "fs";
import Program from "../models/Program.model.js";
import { handleError, handleSuccess } from "../utils/handleResponse.js";
import { devLog } from "../utils/helper.js";

class FileController {
  // Upload document for program
  static async uploadProgramDocument(req, res) {
    try {
      if (!req.file) {
        return handleError(res, 400, "No file uploaded");
      }

      const { programId } = req.params;
      const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};

      const fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: `/api/files/documents/${req.file.filename}`,
        uploadedAt: new Date(),
        metadata,
      };

      // If programId is provided, add to program's documentation
      if (programId) {
        const program = await Program.findById(programId);
        if (!program) {
          return handleError(res, 404, "Program not found");
        }

        const documentEntry = {
          title: metadata.title || req.file.originalname,
          content: metadata.description || "",
          fileUrl: fileInfo.url,
          type: getFileType(req.file.originalname),
          uploadedAt: new Date(),
        };

        program.documentation.push(documentEntry);
        await program.save();

        devLog(`Document uploaded and added to program: ${programId}`);
      }

      return handleSuccess(
        res,
        201,
        {
          id: req.file.filename,
          url: fileInfo.url,
          originalName: req.file.originalname,
          size: req.file.size,
          type: getFileType(req.file.originalname),
        },
        "File uploaded successfully"
      );
    } catch (error) {
      devLog(`Upload document error: ${error.message}`);
      return handleError(res, 500, "Failed to upload document", error);
    }
  }

  // Upload profile picture
  static async uploadProfilePicture(req, res) {
    try {
      if (!req.file) {
        return handleError(res, 400, "No file uploaded");
      }

      const fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: `/api/files/profiles/${req.file.filename}`,
        uploadedAt: new Date(),
      };

      return handleSuccess(
        res,
        201,
        {
          id: req.file.filename,
          url: fileInfo.url,
          originalName: req.file.originalname,
          size: req.file.size,
        },
        "Profile picture uploaded successfully"
      );
    } catch (error) {
      devLog(`Upload profile picture error: ${error.message}`);
      return handleError(res, 500, "Failed to upload profile picture", error);
    }
  }

  // Serve uploaded files
  static async serveFile(req, res) {
    try {
      const { type, filename } = req.params;

      let filePath;
      if (type === "profiles") {
        filePath = path.join(process.cwd(), "storage", "profiles", filename);
      } else if (type === "documents") {
        filePath = path.join(process.cwd(), "storage", "documents", filename);
      } else {
        return handleError(res, 400, "Invalid file type");
      }

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return handleError(res, 404, "File not found");
      }

      // Send file
      res.sendFile(filePath);
    } catch (error) {
      devLog(`Serve file error: ${error.message}`);
      return handleError(res, 500, "Failed to serve file", error);
    }
  }

  // Delete file
  static async deleteFile(req, res) {
    try {
      const { fileId } = req.params;

      // Try to find and delete from both directories
      const profilePath = path.join(
        process.cwd(),
        "storage",
        "profiles",
        fileId
      );
      const documentPath = path.join(
        process.cwd(),
        "storage",
        "documents",
        fileId
      );

      let deletedPath = null;

      if (fs.existsSync(profilePath)) {
        fs.unlinkSync(profilePath);
        deletedPath = profilePath;
      } else if (fs.existsSync(documentPath)) {
        fs.unlinkSync(documentPath);
        deletedPath = documentPath;
      } else {
        return handleError(res, 404, "File not found");
      }

      devLog(`File deleted: ${deletedPath}`);

      return handleSuccess(
        res,
        200,
        { deletedFile: fileId },
        "File deleted successfully"
      );
    } catch (error) {
      devLog(`Delete file error: ${error.message}`);
      return handleError(res, 500, "Failed to delete file", error);
    }
  }

  // Get file info
  static async getFileInfo(req, res) {
    try {
      const { fileId } = req.params;

      const profilePath = path.join(
        process.cwd(),
        "storage",
        "profiles",
        fileId
      );
      const documentPath = path.join(
        process.cwd(),
        "storage",
        "documents",
        fileId
      );

      let filePath = null;
      let fileType = null;

      if (fs.existsSync(profilePath)) {
        filePath = profilePath;
        fileType = "profile";
      } else if (fs.existsSync(documentPath)) {
        filePath = documentPath;
        fileType = "document";
      } else {
        return handleError(res, 404, "File not found");
      }

      const stats = fs.statSync(filePath);
      const fileInfo = {
        id: fileId,
        type: fileType,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        url: `/api/files/${fileType}s/${fileId}`,
      };

      return handleSuccess(
        res,
        200,
        fileInfo,
        "File info retrieved successfully"
      );
    } catch (error) {
      devLog(`Get file info error: ${error.message}`);
      return handleError(res, 500, "Failed to get file info", error);
    }
  }
}

// Helper function to determine file type
const getFileType = (filename) => {
  const extension = path.extname(filename).toLowerCase();
  if ([".pdf"].includes(extension)) return "pdf";
  if ([".doc", ".docx"].includes(extension)) return "doc";
  if ([".mp4", ".avi", ".mov"].includes(extension)) return "video";
  if ([".jpg", ".jpeg", ".png", ".gif"].includes(extension)) return "image";
  if ([".txt", ".md"].includes(extension)) return "text";
  if ([".ppt", ".pptx"].includes(extension)) return "presentation";
  if ([".xls", ".xlsx"].includes(extension)) return "spreadsheet";
  return "text";
};

export default FileController;
