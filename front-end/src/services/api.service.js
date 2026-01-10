// src/services/api.service.js
// Complete API Service for LearninGPT Frontend

import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = authData.accessToken || authData.access;

      if (token && token.length > 10) {
        // Basic validation - JWT tokens are much longer
        config.headers.Authorization = `Bearer ${token}`;
      } else if (token) {
        console.warn(
          "⚠️ Invalid token detected, skipping authorization header"
        );
        // Don't send malformed token
      }
    } catch (error) {
      console.error("❌ Error reading auth token:", error);
      // Continue without token
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authData = JSON.parse(localStorage.getItem("auth") || "{}");
        const refreshToken = authData.refreshToken;

        if (refreshToken) {
          console.log("🔄 [API] Attempting token refresh...");
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {
              refreshToken,
            }
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;

          // Update stored tokens
          const newAuthData = {
            ...authData,
            accessToken,
            refreshToken: newRefreshToken,
          };
          localStorage.setItem("auth", JSON.stringify(newAuthData));

          console.log("✅ [API] Token refreshed successfully");

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } else {
          console.log("⚠️ [API] No refresh token available");
        }
      } catch (refreshError) {
        console.log("❌ [API] Token refresh failed:", refreshError.message);

        // Only redirect to login if we have auth data (user was logged in)
        const authData = JSON.parse(localStorage.getItem("auth") || "{}");
        if (authData.accessToken || authData.refreshToken) {
          localStorage.removeItem("auth");

          // Don't redirect if user is already on login page
          if (!window.location.pathname.includes("/login")) {
            console.log("🔄 [API] Redirecting to login...");
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ===========================
// Authentication APIs
// ===========================

export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", {
      fullname: userData.name,
      email: userData.email,
      password: userData.password,
    });
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await apiClient.post("/auth/verify-otp", { email, otp });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    // Store tokens
    if (response.data.success) {
      localStorage.setItem("auth", JSON.stringify(response.data.data));
    }
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (email, newPassword) => {
    const response = await apiClient.post("/auth/reset-password", {
      email,
      newPassword,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("auth");
    window.location.href = "/login";
  },
};

// ===========================
// User APIs
// ===========================

export const userAPI = {
  getProfile: async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },

  updateProfile: async (updates) => {
    const response = await apiClient.put("/users/account", updates);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.delete("/users/account");
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await apiClient.get("/users/dashboard-stats");
    return response.data;
  },
};

// ===========================
// Subscription APIs
// ===========================

export const subscriptionAPI = {
  getPlans: async () => {
    const response = await apiClient.get("/subscriptions/plans");
    return response.data;
  },

  getUserSubscription: async () => {
    const response = await apiClient.get("/subscriptions/user");
    return response.data;
  },

  createSubscription: async (planId, paymentMethodId = null) => {
    const response = await apiClient.post("/subscriptions/create", {
      planId,
      paymentMethodId,
    });
    return response.data;
  },
};

// ===========================
// Topic APIs
// ===========================

export const topicAPI = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get("/topics", { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/topics/${id}`);
    return response.data;
  },

  create: async (topicData) => {
    const response = await apiClient.post("/topics", topicData);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await apiClient.put(`/topics/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/topics/${id}`);
    return response.data;
  },
};

// ===========================
// Program APIs
// ===========================

export const programAPI = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get("/programs", { params: filters });
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get("/programs/categories");
    return response.data;
  },

  addCategory: async (categoryName) => {
    const response = await apiClient.post("/programs/categories", {
      category: categoryName,
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/programs/${id}`);
    return response.data;
  },

  getPreview: async (id) => {
    const response = await apiClient.get(`/programs/${id}/preview`);
    return response.data;
  },

  create: async (programData) => {
    const response = await apiClient.post("/programs", programData);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await apiClient.put(`/programs/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/programs/${id}`);
    return response.data;
  },

  enroll: async (programId) => {
    const response = await apiClient.post(`/programs/${programId}/enroll`);
    return response.data;
  },

  getDocuments: async (programId) => {
    const response = await apiClient.get(`/programs/${programId}/documents`);
    return response.data;
  },
};

// ===========================
// Quiz Attempt APIs
// ===========================

export const quizAPI = {
  start: async (programId) => {
    const response = await apiClient.post(`/attempts/start/${programId}`);
    return response.data;
  },

  submit: async (attemptId, answers, timeTaken) => {
    const response = await apiClient.post(`/attempts/${attemptId}/submit`, {
      answers,
      timeTaken,
    });
    return response.data;
  },

  getResult: async (attemptId) => {
    const response = await apiClient.get(`/attempts/${attemptId}`);
    return response.data;
  },

  getUserAttempts: async (filters = {}) => {
    const response = await apiClient.get("/attempts/user", { params: filters });
    return response.data;
  },

  abandon: async (attemptId) => {
    const response = await apiClient.post(`/attempts/${attemptId}/abandon`);
    return response.data;
  },
};

// ===========================
// AI Chat APIs
// ===========================

// External AI Chat API client (for real AI responses)
const externalAiClient = axios.create({
  baseURL:
    import.meta.env.VITE_EXTERNAL_AI_URL || "http://10.10.7.82:8008/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const aiChatAPI = {
  createSession: async (topic, programId = null, context = "general") => {
    const response = await apiClient.post("/ai-chat/session", {
      topic,
      program_id: programId,
      context,
    });
    return response.data;
  },

  sendMessage: async (
    sessionId,
    message,
    skillLevel = "beginner",
    programId = null
  ) => {
    const response = await apiClient.post("/ai-chat/message", {
      sessionId,
      message,
      skill_level: skillLevel,
      program_id: programId,
    });
    return response.data;
  },

  // NEW: Send message to external AI API (real AI responses)
  sendMessageToExternalAI: async (
    message,
    skillLevel = "beginner",
    sessionId,
    programId
  ) => {
    try {
      console.log("🔄 Calling external AI API...");
      console.log("Endpoint: http://10.10.7.82:8008/api/v1/chat/");
      console.log("Request payload:", {
        message,
        skill_level: skillLevel,
        session_id: sessionId,
        program_id: programId,
      });

      const response = await externalAiClient.post("/chat/", {
        message,
        skill_level: skillLevel,
        session_id: sessionId,
        program_id: programId,
      });

      console.log("✅ API Response received:", response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Error sending message to external AI:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response);
      console.error("Error config:", error.config);

      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to get AI response",
      };
    }
  },

  getSessions: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/ai-chat/sessions", {
      params: { page, limit },
    });
    return response.data;
  },

  getSession: async (sessionId) => {
    const response = await apiClient.get(`/ai-chat/session/${sessionId}`);
    return response.data;
  },

  updateSession: async (sessionId, updates) => {
    const response = await apiClient.put(
      `/ai-chat/session/${sessionId}`,
      updates
    );
    return response.data;
  },

  deleteSession: async (sessionId) => {
    const response = await apiClient.delete(`/ai-chat/session/${sessionId}`);
    return response.data;
  },

  submitFeedback: async (sessionId, rating, feedback, messageId = null) => {
    const response = await apiClient.post(
      `/ai-chat/session/${sessionId}/feedback`,
      {
        rating,
        feedback,
        messageId,
      }
    );
    return response.data;
  },
};

// ===========================
// Admin APIs
// ===========================

export const adminAPI = {
  getDashboardStats: async () => {
    const response = await apiClient.get("/admin/dashboard/stats");
    return response.data;
  },

  getAllUsers: async (filters = {}) => {
    const response = await apiClient.get("/admin/users", { params: filters });
    return response.data;
  },

  getAllAttempts: async (filters = {}) => {
    const response = await apiClient.get("/admin/attempts", {
      params: filters,
    });
    return response.data;
  },

  updateProgramStatus: async (programId, status) => {
    const response = await apiClient.put(
      `/admin/programs/${programId}/status`,
      { status }
    );
    return response.data;
  },

  deleteProgram: async (programId) => {
    const response = await apiClient.delete(`/admin/programs/${programId}`);
    return response.data;
  },

  getAnalytics: async (startDate = null, endDate = null) => {
    const response = await apiClient.get("/admin/analytics", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  bulkUpdatePrograms: async (programIds, updates) => {
    const response = await apiClient.put("/admin/programs/bulk", {
      programIds,
      updates,
    });
    return response.data;
  },
};

// ===========================
// Quiz Management APIs
// ===========================

export const quizManagementAPI = {
  // Get all quizzes with filtering
  getAllQuizzes: async (filters = {}) => {
    const response = await apiClient.get("/quiz", { params: filters });
    return response.data;
  },

  // Get quiz by ID
  getQuizById: async (quizId) => {
    const response = await apiClient.get(`/quiz/${quizId}`);
    return response.data;
  },

  // Create new quiz
  createQuiz: async (quizData) => {
    const response = await apiClient.post("/quiz", quizData);
    return response.data;
  },

  // Update quiz
  updateQuiz: async (quizId, updateData) => {
    const response = await apiClient.put(`/quiz/${quizId}`, updateData);
    return response.data;
  },

  // Delete quiz
  deleteQuiz: async (quizId) => {
    const response = await apiClient.delete(`/quiz/${quizId}`);
    return response.data;
  },

  // Get quizzes by program
  getQuizzesByProgram: async (programId) => {
    const response = await apiClient.get(`/quiz/program/${programId}`);
    return response.data;
  },

  // Get quiz statistics
  getQuizStatistics: async (quizId) => {
    const response = await apiClient.get(`/quiz/${quizId}/statistics`);
    return response.data;
  },

  // Create program with exam simulator
  createProgramWithQuiz: async (programData) => {
    const response = await apiClient.post(
      "/quiz/program-with-quiz",
      programData
    );
    return response.data;
  },

  // Update program exam simulator
  updateProgramExamSimulator: async (programId, examSimulator) => {
    const response = await apiClient.put(
      `/quiz/program/${programId}/exam-simulator`,
      { examSimulator }
    );
    return response.data;
  },

  // Get dashboard quiz statistics
  getDashboardQuizStats: async () => {
    const response = await apiClient.get("/quiz/admin/dashboard-stats");
    return response.data;
  },
};

// ===========================
// Question Management APIs
// ===========================

export const questionAPI = {
  // Get all questions with filtering
  getAllQuestions: async (filters = {}) => {
    const response = await apiClient.get("/question", { params: filters });
    return response.data;
  },

  // Get question bank (unassigned questions)
  getQuestionBank: async (filters = {}) => {
    const response = await apiClient.get("/question/bank", { params: filters });
    return response.data;
  },

  // Get question by ID
  getQuestionById: async (questionId) => {
    const response = await apiClient.get(`/question/${questionId}`);
    return response.data;
  },

  // Create new question
  createQuestion: async (questionData) => {
    const response = await apiClient.post("/question", questionData);
    return response.data;
  },

  // Bulk create questions
  bulkCreateQuestions: async (questions, quizId = null) => {
    const response = await apiClient.post("/question/bulk", {
      questions,
      quizId,
    });
    return response.data;
  },

  // Update question
  updateQuestion: async (questionId, updateData) => {
    const response = await apiClient.put(`/question/${questionId}`, updateData);
    return response.data;
  },

  // Delete question
  deleteQuestion: async (questionId) => {
    const response = await apiClient.delete(`/question/${questionId}`);
    return response.data;
  },

  // Bulk delete questions
  bulkDeleteQuestions: async (questionIds) => {
    const response = await apiClient.delete("/question/bulk", {
      data: { questionIds },
    });
    return response.data;
  },

  // Get questions by quiz
  getQuestionsByQuiz: async (quizId, includeAnswers = false) => {
    const response = await apiClient.get(`/question/quiz/${quizId}`, {
      params: { includeAnswers },
    });
    return response.data;
  },

  // Add questions to quiz from question bank
  addQuestionsToQuiz: async (quizId, questionIds) => {
    const response = await apiClient.post(
      `/question/quiz/${quizId}/add-questions`,
      { questionIds }
    );
    return response.data;
  },
};

// ===========================
// Topic Management APIs
// ===========================

export const topicManagementAPI = {
  // Get all topics
  getAllTopics: async (filters = {}) => {
    const response = await apiClient.get("/topics", { params: filters });
    return response.data;
  },

  // Get topic by ID
  getTopicById: async (topicId) => {
    const response = await apiClient.get(`/topics/${topicId}`);
    return response.data;
  },

  // Create new topic
  createTopic: async (topicData) => {
    // Check if topicData is FormData (for file upload)
    const headers =
      topicData instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : {};

    const response = await apiClient.post("/topics", topicData, { headers });
    return response.data;
  },

  // Update topic
  updateTopic: async (topicId, updateData) => {
    // Check if updateData is FormData (for file upload)
    const headers =
      updateData instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : {};

    const response = await apiClient.put(`/topics/${topicId}`, updateData, {
      headers,
    });
    return response.data;
  },

  // Delete topic
  deleteTopic: async (topicId) => {
    const response = await apiClient.delete(`/topics/${topicId}`);
    return response.data;
  },

  // Get programs by topic
  getProgramsByTopic: async (topicId) => {
    const response = await apiClient.get(`/topics/${topicId}/programs`);
    return response.data;
  },
};

// ===========================
// File Upload APIs
// ===========================

export const fileUploadAPI = {
  // Upload document for program (or standalone)
  uploadDocument: async (file, programId = null, metadata = {}) => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("metadata", JSON.stringify(metadata));

    const endpoint = programId
      ? `/files/upload-document/${programId}`
      : "/files/upload-document";

    const response = await apiClient.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append("profile", file);

    const response = await apiClient.post("/files/upload-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get file info
  getFileInfo: async (fileId) => {
    const response = await apiClient.get(`/files/info/${fileId}`);
    return response.data;
  },

  // Delete file
  deleteFile: async (fileId) => {
    const response = await apiClient.delete(`/files/${fileId}`);
    return response.data;
  },

  // Get file URL
  getFileUrl: (type, filename) => {
    return `${API_BASE_URL}/files/${type}/${filename}`;
  },
};

// ===========================
// Payment APIs (Stripe)
// ===========================

export const paymentAPI = {
  // Create checkout session for course purchase
  createCheckoutSession: async (programId, accessType = "documentation") => {
    const response = await apiClient.post("/payments/create-checkout-session", {
      programId,
      accessType,
    });
    return response.data;
  },

  // Verify payment after redirect
  verifyPayment: async (sessionId) => {
    const response = await apiClient.get(
      `/payments/verify-payment?sessionId=${sessionId}`
    );
    return response.data;
  },

  // Check if user has access to a course
  checkAccess: async (programId, accessType = "documentation") => {
    const response = await apiClient.get(
      `/payments/check-access/${programId}?accessType=${accessType}`
    );
    return response.data;
  },

  // Get course pricing
  getPricing: async (programId) => {
    const response = await apiClient.get(`/payments/pricing/${programId}`);
    return response.data;
  },

  // Get user's purchases
  getMyPurchases: async () => {
    const response = await apiClient.get("/payments/my-purchases");
    return response.data;
  },
};

// ===========================
// Error Handler Helper
// ===========================

export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data.message || "An error occurred",
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: "No response from server. Please check your connection.",
      status: 0,
    };
  } else {
    // Something else happened
    return {
      message: error.message || "An unexpected error occurred",
      status: -1,
    };
  }
};

// Export axios instance for custom requests
export default apiClient;

// Helper function to get full image URL from storage path
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Remove leading slash if present
  const path = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;

  // Get base URL without /api
  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api", "")
    : "http://localhost:5000";

  return `${baseUrl}/${path}`;
};
