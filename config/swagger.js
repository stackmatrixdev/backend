import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LearnGPT API Documentation",
      version: "1.0.0",
      description:
        "Complete API documentation for LearnGPT - AI-powered learning platform with quiz management, topic creation, and student analytics",
      contact: {
        name: "API Support",
        email: "support@learngpt.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://api.learngpt.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6939d447dd1eaab46e6815b7" },
            name: { type: "string", example: "John Black" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
            profileImage: {
              type: "string",
              example: "http://localhost:3000/storage/profiles/photo.jpg",
            },
            stats: {
              type: "object",
              properties: {
                quizzesCompleted: { type: "number", example: 12 },
                totalQuizzes: { type: "number", example: 15 },
                averageScore: { type: "number", example: 87 },
                aiInteractions: { type: "number", example: 156 },
                enrolledPrograms: { type: "number", example: 8 },
                completedPrograms: { type: "number", example: 3 },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Topic: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6939f3380450fed88651a5b3" },
            title: { type: "string", example: "JavaScript Fundamentals" },
            description: {
              type: "string",
              example: "Learn JavaScript from scratch",
            },
            category: {
              type: "string",
              enum: [
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
              ],
              example: "Development",
            },
            numberOfFreeQuestions: { type: "number", example: 5 },
            pricing: {
              type: "object",
              properties: {
                chatbotPrice: { type: "number", example: 9.99 },
                documentationPrice: { type: "number", example: 4.99 },
                examSimulatorPrice: { type: "number", example: 14.99 },
                bundlePrice: { type: "number", example: 24.99 },
                currency: { type: "string", example: "CAD" },
              },
            },
            overview: {
              type: "string",
              example: "<h1>Course Overview</h1><p>Details...</p>",
            },
            coverImage: {
              type: "string",
              example: "https://example.com/cover.jpg",
            },
            status: {
              type: "string",
              enum: ["draft", "published", "archived"],
              example: "draft",
            },
            createdBy: { type: "string", example: "6939d447dd1eaab46e6815b7" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Program: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6939f3380450fed88651a5a8" },
            name: { type: "string", example: "JavaScript Fundamentals" },
            topic: { type: "string", example: "Programming Basics" },
            category: { type: "string", example: "Development" },
            description: {
              type: "string",
              example: "Learn JavaScript from scratch",
            },
            difficulty: {
              type: "string",
              enum: ["Beginner", "Intermediate", "Advanced"],
              example: "Beginner",
            },
            examSimulator: {
              type: "object",
              properties: {
                enabled: { type: "boolean", example: true },
                totalMarks: { type: "number", example: 100 },
                timeLimit: { type: "number", example: 30 },
                maxAttempts: { type: "number", example: 3 },
                questions: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Question" },
                },
              },
            },
            status: {
              type: "string",
              enum: ["draft", "published", "archived"],
              example: "draft",
            },
            createdBy: { type: "string", example: "6939d447dd1eaab46e6815b7" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Question: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6939f3380450fed88651a5a9" },
            type: {
              type: "string",
              enum: ["single-choice", "multi-choice", "text", "fill-in-gap"],
              example: "single-choice",
            },
            questionText: { type: "string", example: "What is JavaScript?" },
            mark: { type: "number", example: 10 },
            skillLevel: {
              type: "string",
              enum: ["easy", "medium", "hard"],
              example: "easy",
            },
            options: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  key: { type: "string", example: "a" },
                  value: { type: "string", example: "A programming language" },
                },
              },
            },
            correctAnswers: {
              type: "array",
              items: { type: "string" },
              example: ["a"],
            },
            explanation: {
              type: "string",
              example: "JavaScript is a programming language",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
            error: { type: "object" },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user",
          description:
            "Create a new user account. An OTP will be sent to the email for verification.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["fullname", "email", "password"],
                  properties: {
                    fullname: { type: "string", example: "John Doe" },
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    password: {
                      type: "string",
                      minLength: 6,
                      example: "password123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully. OTP sent to email.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" },
                },
              },
            },
            400: { description: "User already exists or validation error" },
          },
        },
      },
      "/api/auth/verify-otp": {
        post: {
          tags: ["Authentication"],
          summary: "Verify email with OTP",
          description:
            "Verify user email using the OTP sent during registration",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "otp"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    otp: { type: "string", example: "123456" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "User verified successfully" },
            400: { description: "Invalid or expired OTP" },
            404: { description: "User not found" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Login with email and password",
          description:
            "Authenticate user and receive access and refresh tokens",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          accessToken: { type: "string" },
                          refreshToken: { type: "string" },
                          user: { $ref: "#/components/schemas/User" },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Invalid credentials" },
            403: { description: "Email not verified" },
          },
        },
      },
      "/api/auth/refresh": {
        post: {
          tags: ["Authentication"],
          summary: "Refresh access token",
          description: "Get a new access token using refresh token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["refreshToken"],
                  properties: {
                    refreshToken: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Token refreshed successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      accessToken: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { description: "Invalid refresh token" },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Authentication"],
          summary: "Logout user",
          description: "Clear authentication cookies and logout user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Logout successful" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/auth/forgot-password": {
        post: {
          tags: ["Authentication"],
          summary: "Request password reset",
          description: "Request a password reset. OTP will be sent to email.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "OTP sent to email" },
            404: { description: "User not found" },
            429: { description: "Too many requests. Try again later." },
          },
        },
      },
      "/api/auth/reset-password": {
        post: {
          tags: ["Authentication"],
          summary: "Reset password with OTP",
          description: "Reset password using email and new password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "newPassword"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    newPassword: {
                      type: "string",
                      minLength: 6,
                      example: "newpassword123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Password reset successful" },
            400: {
              description: "Invalid request or password reset not allowed",
            },
            404: { description: "User not found" },
          },
        },
      },
      "/api/users/profile": {
        get: {
          tags: ["Users"],
          summary: "Get user profile",
          description: "Retrieve authenticated user's profile information",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Profile retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      data: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Update user profile",
          description:
            "Update user profile information (name, email, password)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "John Doe Updated" },
                    email: {
                      type: "string",
                      format: "email",
                      example: "newemail@example.com",
                    },
                    password: {
                      type: "string",
                      minLength: 6,
                      example: "newpassword123",
                    },
                    confirmPassword: {
                      type: "string",
                      example: "newpassword123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Profile updated successfully" },
            400: {
              description: "Validation error (e.g., passwords don't match)",
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/users/profile/image": {
        post: {
          tags: ["Users"],
          summary: "Upload profile image",
          description:
            "Upload a profile image (max 5MB, formats: jpeg, jpg, png, gif, webp)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["profileImage"],
                  properties: {
                    profileImage: {
                      type: "string",
                      format: "binary",
                      description: "Image file (max 5MB)",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Image uploaded successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          profileImage: { type: "string" },
                          filename: { type: "string" },
                          path: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: { description: "No file provided or invalid file type" },
            401: { description: "Unauthorized" },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete profile image",
          description: "Delete user's profile image",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Profile image deleted successfully" },
            404: { description: "No profile image to delete" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/users/stats": {
        get: {
          tags: ["Users"],
          summary: "Get user statistics (Student Dashboard)",
          description:
            "Retrieve comprehensive user statistics including quiz results and achievements",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Statistics retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          user: {
                            type: "object",
                            properties: {
                              name: { type: "string" },
                              email: { type: "string" },
                              profileImage: { type: "string" },
                            },
                          },
                          overview: {
                            type: "object",
                            properties: {
                              quizzesCompleted: { type: "number" },
                              totalQuizzes: { type: "number" },
                              quizScoreAverage: { type: "string" },
                              aiInteractions: { type: "number" },
                              enrolledPrograms: { type: "number" },
                              completedPrograms: { type: "number" },
                            },
                          },
                          recentQuizResults: { type: "array" },
                          recentAchievements: { type: "array" },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Only available for students (role='user')" },
          },
        },
      },
      "/api/users/ai-interaction": {
        post: {
          tags: ["Users"],
          summary: "Increment AI interaction count",
          description: "Record an AI chatbot interaction for the user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "AI interaction recorded",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          aiInteractions: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/topics": {
        get: {
          tags: ["Topics"],
          summary: "Get all topics",
          description: "Retrieve all topics with optional filtering",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "category",
              in: "query",
              schema: { type: "string" },
              description: "Filter by category",
            },
            {
              name: "status",
              in: "query",
              schema: {
                type: "string",
                enum: ["draft", "published", "archived"],
              },
              description: "Filter by status",
            },
            {
              name: "search",
              in: "query",
              schema: { type: "string" },
              description: "Search in title or description",
            },
            {
              name: "isActive",
              in: "query",
              schema: { type: "boolean" },
              description: "Filter by active status",
            },
          ],
          responses: {
            200: {
              description: "Topics retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      count: { type: "number" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Topic" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Topics"],
          summary: "Create a new topic",
          description: "Create a new learning topic with pricing information",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "description", "category", "overview"],
                  properties: {
                    title: {
                      type: "string",
                      example: "JavaScript Fundamentals",
                    },
                    description: {
                      type: "string",
                      example: "Learn JavaScript from scratch",
                    },
                    category: { type: "string", example: "Development" },
                    numberOfFreeQuestions: { type: "number", example: 5 },
                    chatbotPrice: { type: "number", example: 9.99 },
                    documentationPrice: { type: "number", example: 4.99 },
                    examSimulatorPrice: { type: "number", example: 14.99 },
                    bundlePrice: { type: "number", example: 24.99 },
                    overview: {
                      type: "string",
                      example: "<h1>Course Overview</h1>",
                    },
                    coverImage: {
                      type: "string",
                      example: "https://example.com/cover.jpg",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Topic created successfully" },
            400: { description: "Validation error or topic already exists" },
          },
        },
      },
      "/api/topics/{id}": {
        get: {
          tags: ["Topics"],
          summary: "Get single topic",
          description: "Retrieve a specific topic by ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Topic ID",
            },
          ],
          responses: {
            200: {
              description: "Topic retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: { $ref: "#/components/schemas/Topic" },
                    },
                  },
                },
              },
            },
            404: { description: "Topic not found" },
          },
        },
        put: {
          tags: ["Topics"],
          summary: "Update topic",
          description: "Update an existing topic (only by creator)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Topic ID",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    category: { type: "string" },
                    numberOfFreeQuestions: { type: "number" },
                    chatbotPrice: { type: "number" },
                    documentationPrice: { type: "number" },
                    examSimulatorPrice: { type: "number" },
                    bundlePrice: { type: "number" },
                    overview: { type: "string" },
                    coverImage: { type: "string" },
                    status: { type: "string" },
                    isActive: { type: "boolean" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Topic updated successfully" },
            403: { description: "Not authorized to update this topic" },
            404: { description: "Topic not found" },
          },
        },
        delete: {
          tags: ["Topics"],
          summary: "Delete topic",
          description: "Delete a topic (only by creator)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Topic ID",
            },
          ],
          responses: {
            200: { description: "Topic deleted successfully" },
            403: { description: "Not authorized to delete this topic" },
            404: { description: "Topic not found" },
          },
        },
      },
      "/api/programs": {
        get: {
          tags: ["Programs"],
          summary: "Get all programs",
          description: "Retrieve all learning programs with optional filtering",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "category",
              in: "query",
              schema: { type: "string" },
              description: "Filter by category",
            },
            {
              name: "difficulty",
              in: "query",
              schema: {
                type: "string",
                enum: ["Beginner", "Intermediate", "Advanced"],
              },
              description: "Filter by difficulty level",
            },
            {
              name: "status",
              in: "query",
              schema: {
                type: "string",
                enum: ["draft", "published", "archived"],
              },
              description: "Filter by status",
            },
            {
              name: "search",
              in: "query",
              schema: { type: "string" },
              description: "Search in name, topic, or description",
            },
          ],
          responses: {
            200: {
              description: "Programs retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      count: { type: "number" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Program" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Programs"],
          summary: "Create a new program",
          description: "Create a new learning program with optional quiz",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "topic", "category", "description"],
                  properties: {
                    name: {
                      type: "string",
                      example: "JavaScript Fundamentals",
                    },
                    topic: { type: "string", example: "Programming Basics" },
                    category: { type: "string", example: "Development" },
                    description: {
                      type: "string",
                      example: "Learn JavaScript from scratch",
                    },
                    difficulty: {
                      type: "string",
                      enum: ["Beginner", "Intermediate", "Advanced"],
                      example: "Beginner",
                    },
                    examSimulator: {
                      type: "object",
                      properties: {
                        enabled: { type: "boolean" },
                        totalMarks: { type: "number" },
                        timeLimit: { type: "number" },
                        maxAttempts: { type: "number" },
                        questions: { type: "array" },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Program created successfully" },
            400: { description: "Validation error or program already exists" },
          },
        },
      },
      "/api/programs/{id}": {
        get: {
          tags: ["Programs"],
          summary: "Get single program",
          description: "Retrieve a specific program by ID with all details",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Program ID",
            },
          ],
          responses: {
            200: {
              description: "Program retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: { $ref: "#/components/schemas/Program" },
                    },
                  },
                },
              },
            },
            404: { description: "Program not found" },
          },
        },
        put: {
          tags: ["Programs"],
          summary: "Update program",
          description: "Update an existing program (only by creator)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Program ID",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    topic: { type: "string" },
                    category: { type: "string" },
                    description: { type: "string" },
                    difficulty: { type: "string" },
                    status: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Program updated successfully" },
            403: { description: "Not authorized to update this program" },
            404: { description: "Program not found" },
          },
        },
        delete: {
          tags: ["Programs"],
          summary: "Delete program",
          description: "Delete a program (only by creator)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Program ID",
            },
          ],
          responses: {
            200: { description: "Program deleted successfully" },
            403: { description: "Not authorized to delete this program" },
            404: { description: "Program not found" },
          },
        },
      },
      "/api/programs/{id}/quiz/preview": {
        get: {
          tags: ["Questions"],
          summary: "Get quiz preview",
          description:
            "Get formatted quiz questions for preview (without correct answers)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Program ID",
            },
          ],
          responses: {
            200: {
              description: "Quiz preview retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "object",
                        properties: {
                          programName: { type: "string" },
                          totalMarks: { type: "number" },
                          timeLimit: { type: "number" },
                          totalQuestions: { type: "number" },
                          questions: { type: "array" },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: "Program or quiz not found" },
          },
        },
      },
      "/api/programs/{id}/questions": {
        post: {
          tags: ["Questions"],
          summary: "Add question to program",
          description: "Add a new question to the program's exam simulator",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Program ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["type", "questionText", "mark", "correctAnswers"],
                  properties: {
                    type: {
                      type: "string",
                      enum: [
                        "single-choice",
                        "multi-choice",
                        "text",
                        "fill-in-gap",
                      ],
                      example: "single-choice",
                    },
                    questionText: {
                      type: "string",
                      example: "What is JavaScript?",
                    },
                    mark: { type: "number", example: 10 },
                    skillLevel: {
                      type: "string",
                      enum: ["easy", "medium", "hard"],
                      example: "easy",
                    },
                    options: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          key: { type: "string", example: "a" },
                          value: {
                            type: "string",
                            example: "A programming language",
                          },
                        },
                      },
                    },
                    correctAnswers: {
                      type: "array",
                      items: { type: "string" },
                      example: ["a"],
                    },
                    explanation: {
                      type: "string",
                      example: "JavaScript is a programming language",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Question added successfully" },
            400: { description: "Validation error" },
            404: { description: "Program not found" },
          },
        },
      },
      "/api/programs/{programId}/questions/{questionId}": {
        put: {
          tags: ["Questions"],
          summary: "Update question",
          description: "Update an existing question in a program",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "programId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Program ID",
            },
            {
              name: "questionId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Question ID",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    questionText: { type: "string" },
                    mark: { type: "number" },
                    skillLevel: { type: "string" },
                    options: { type: "array" },
                    correctAnswers: { type: "array" },
                    explanation: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Question updated successfully" },
            404: { description: "Program or question not found" },
          },
        },
        delete: {
          tags: ["Questions"],
          summary: "Delete question",
          description: "Delete a question from a program",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "programId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Program ID",
            },
            {
              name: "questionId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Question ID",
            },
          ],
          responses: {
            200: { description: "Question deleted successfully" },
            404: { description: "Program or question not found" },
          },
        },
      },
      "/api/programs/{id}/quiz": {
        delete: {
          tags: ["Questions"],
          summary: "Delete entire quiz",
          description: "Disable the exam simulator for a program",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Program ID",
            },
          ],
          responses: {
            200: { description: "Quiz deleted successfully" },
            404: { description: "Program not found" },
          },
        },
      },
    },
  },
  apis: [], // All paths defined above, no need to scan files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
