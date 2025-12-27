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

ensureDirectoryExists(profileStorageDir);
ensureDirectoryExists(documentStorageDir);

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

// File filter - documents allow various file types
const documentFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt|md|ppt|pptx|xls|xlsx|mp4|avi|mov/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "File type not allowed. Allowed types: pdf, doc, docx, txt, md, ppt, pptx, xls, xlsx, mp4, avi, mov"
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

// Configure upload middleware for documents
const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for documents
  },
  fileFilter: documentFileFilter,
});

// Export both upload middlewares
export const upload = uploadProfile; // Keep default export for backward compatibility
export { uploadProfile, uploadDocument };

export default upload;
