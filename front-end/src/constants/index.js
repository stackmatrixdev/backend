// Centralized constants for the application
// These match the backend enum values exactly

export const PROGRAM_CATEGORIES = [
  "Development",
  "Business",
  "Marketing",
  "Lifestyle",
  "Music",
  "Design",
  "Academics",
  "Health & Fitness",
  "Productivity",
  "Accounting",
];

export const PROGRAM_TOPICS = [
  "Immigration & Language Preparation",
  "Project Management",
  "Tech & Development",
  "Office Tools",
  "Office Productivity",
  "Personal Development",
  "Lifestyle",
  "Photography & Video",
];

export const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const QUESTION_TYPES = [
  "Single Choice MCQ",
  "Multiple Choice MCQ",
  "True/False",
  "Short Answer",
  "Essay",
];

export const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

// File upload constants
export const FILE_TYPES = {
  DOCUMENTS: ["pdf", "doc", "docx", "txt", "md", "ppt", "pptx", "xls", "xlsx"],
  VIDEOS: ["mp4", "avi", "mov", "wmv", "mkv"],
  IMAGES: ["jpg", "jpeg", "png", "gif", "webp"],
  ALL_SUPPORTED: [
    "pdf",
    "doc",
    "docx",
    "txt",
    "md",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "mp4",
    "avi",
    "mov",
    "wmv",
    "mkv",
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
  ],
};

export const FILE_SIZE_LIMITS = {
  PROFILE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 50 * 1024 * 1024, // 50MB
  VIDEO: 100 * 1024 * 1024, // 100MB
};

// API endpoints
export const API_ENDPOINTS = {
  FILES: {
    UPLOAD_DOCUMENT: "/files/upload-document",
    UPLOAD_PROFILE: "/files/upload-profile",
    GET_FILE: "/files",
    DELETE_FILE: "/files",
  },
  QUIZ: {
    CREATE_WITH_PROGRAM: "/quiz/program-with-quiz",
    GET_ALL: "/quiz",
    GET_BY_ID: "/quiz",
    UPDATE: "/quiz",
    DELETE: "/quiz",
  },
};

export default {
  PROGRAM_CATEGORIES,
  PROGRAM_TOPICS,
  DIFFICULTY_LEVELS,
  QUESTION_TYPES,
  SKILL_LEVELS,
  FILE_TYPES,
  FILE_SIZE_LIMITS,
  API_ENDPOINTS,
};
