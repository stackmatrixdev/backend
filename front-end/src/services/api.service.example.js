// src/services/api.service.js
// Complete API Service for LearninGPT Frontend

import axios from "axios";

const API_BASE_URL =
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
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData.accessToken || authData.access;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem("auth");
        window.location.href = "/login";
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
