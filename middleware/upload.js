import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure storage directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const profileStorageDir = path.join(process.cwd(), "storage", "profiles");
const documentStorageDir = path.join(process.cwd(), "storage", "documents");
const courseImageStorageDir = path.join(process.cwd(), "storage", "courses");

ensureDirectoryExists(profileStorageDir);
ensureDirectoryExists(documentStorageDir);
ensureDirectoryExists(courseImageStorageDir);

// Configure multer storage for profiles
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profileStorageDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `${req.user.id}_${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// Configure multer storage for documents
const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, documentStorageDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `doc_${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// Configure multer storage for course images
const courseImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, courseImageStorageDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `course_${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// File filter - profiles only allow images
const profileFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = file.mimetype.startsWith("image/");

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

// File filter - documents allow various file types including PDFs and videos
const documentFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt|md|ppt|pptx|xls|xlsx|mp4|avi|mov|mkv|webm/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "File type not allowed. Allowed types: pdf, doc, docx, txt, md, ppt, pptx, xls, xlsx, mp4, avi, mov, mkv, webm"
      )
    );
  }
};

// Configure upload middleware for profiles
const uploadProfile = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: profileFileFilter,
});

// Configure upload middleware for documents (PDFs, videos, etc.)
const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB limit for documents and videos
  },
  fileFilter: documentFileFilter,
});

// Configure upload middleware for course images
const uploadCourseImage = multer({
  storage: courseImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for course images
  },
  fileFilter: profileFileFilter, // Use same image filter as profile
});

// Export both upload middlewares
export const upload = uploadProfile; // Keep default export for backward compatibility
export { uploadProfile, uploadDocument, uploadCourseImage };

// Optional document upload middleware - allows requests without files
export const optionalDocumentUpload = (req, res, next) => {
  uploadDocument.single("document")(req, res, (err) => {
    if (err) {
      // If it's a multer error, return error
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      // If it's another error, return it
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
    }
    // Continue even if no file was uploaded (for external URLs)
    next();
  });
};

export default upload;
