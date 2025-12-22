# 🚀 LearninGPT Backend API Endpoints

**Base URL**: `http://localhost:5000/api` (Development)

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Topics](#topics)
4. [Programs](#programs)
5. [Quiz Attempts](#quiz-attempts)
6. [AI Chat](#ai-chat)
7. [Admin](#admin)
8. [Certificates](#certificates)
9. [Subscriptions](#subscriptions)

---

## 🔐 Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: OTP sent to email

### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "email": "john@example.com",
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "isActive": true
  }
}
```

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "newPassword": "newpassword123"
}
```

### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

---

## 👤 Users

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer {accessToken}
```

### Update Profile
```http
PUT /api/users/account
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Updated Name",
  "avatar": "url_to_avatar"
}
```

### Delete Account
```http
DELETE /api/users/account
Authorization: Bearer {accessToken}
```

---

## 📚 Topics

### Get All Topics
```http
GET /api/topics
Authorization: Bearer {accessToken}

Query Parameters:
  - category: string (optional)
  - status: draft|published|archived (optional)
  - search: string (optional)
  - isActive: boolean (optional)
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "topic_id",
      "title": "Immigration & Language Preparation",
      "description": "Master language skills...",
      "category": "Development",
      "numberOfFreeQuestions": 3,
      "pricing": {
        "chatbotPrice": 19.99,
        "documentationPrice": 15.99,
        "examSimulatorPrice": 19.99,
        "bundlePrice": 39.99,
        "currency": "CAD"
      },
      "overview": "<p>HTML content...</p>",
      "coverImage": "url_to_image",
      "status": "published",
      "isActive": true,
      "stats": {
        "enrolledUsers": 0,
        "totalPrograms": 0,
        "averageRating": 0,
        "totalReviews": 0
      }
    }
  ]
}
```

### Create Topic (Admin Only)
```http
POST /api/topics
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Topic Title",
  "description": "Topic description",
  "category": "Development",
  "numberOfFreeQuestions": 3,
  "chatbotPrice": 19.99,
  "documentationPrice": 15.99,
  "examSimulatorPrice": 19.99,
  "bundlePrice": 39.99,
  "overview": "<p>HTML content</p>",
  "coverImage": "url_to_image"
}
```

### Get Single Topic
```http
GET /api/topics/:id
Authorization: Bearer {accessToken}
```

### Update Topic
```http
PUT /api/topics/:id
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Delete Topic
```http
DELETE /api/topics/:id
Authorization: Bearer {accessToken}
```

---

## 🎓 Programs (Learning Programs/Quizzes)

### Get All Programs
```http
GET /api/programs

Query Parameters:
  - category: string (optional)
  - difficulty: Beginner|Intermediate|Advanced (optional)
  - status: draft|published|archived (optional)
  - search: string (optional)
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "program_id",
      "name": "Immigration Training",
      "topic": "IELTS Preparation",
      "category": "Development",
      "description": "Complete IELTS training...",
      "difficulty": "Intermediate",
      "examSimulator": {
        "enabled": true,
        "totalMarks": 100,
        "timeLimit": 90,
        "maxAttempts": 3,
        "questions": [...]
      },
      "guidedQuestions": {
        "enabled": true,
        "freeAttempts": 3,
        "questions": [...]
      },
      "documentation": [],
      "settings": {
        "shuffleQuestions": true,
        "isActive": true,
        "isPaid": true,
        "price": 19.99
      }
    }
  ]
}
```

### Create Program
```http
POST /api/programs
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Program Title",
  "topic": "Program Topic",
  "category": "Development",
  "description": "Program description",
  "difficulty": "Beginner",
  "examSimulator": {
    "enabled": true,
    "totalMarks": 100,
    "timeLimit": 15,
    "maxAttempts": 1,
    "questions": [
      {
        "type": "single-choice",
        "questionText": "What is React?",
        "mark": 5,
        "skillLevel": "beginner",
        "options": ["A library", "A framework", "A language", "A database"],
        "correctAnswers": [0],
        "explanation": "React is a JavaScript library..."
      }
    ]
  },
  "guidedQuestions": {
    "enabled": true,
    "freeAttempts": 3,
    "questions": [
      {
        "question": "Explain React components",
        "answer": "Components are..."
      }
    ]
  },
  "documents": [
    {
      "title": "Study Material",
      "description": "Complete guide",
      "fileUrl": "url_to_file",
      "fileType": "pdf"
    }
  ],
  "settings": {
    "shuffleQuestions": false,
    "isActive": true,
    "isPaid": false,
    "price": 0
  }
}
```

### Get Single Program
```http
GET /api/programs/:id
```

### Get Program Preview
```http
GET /api/programs/:id/preview
```

### Update Program
```http
PUT /api/programs/:id
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Delete Program
```http
DELETE /api/programs/:id
Authorization: Bearer {accessToken}
```

### Enroll in Program
```http
POST /api/programs/:id/enroll
Authorization: Bearer {accessToken}
```

---

## ✅ Quiz Attempts

### Start Quiz
```http
POST /api/attempts/start/:programId
Authorization: Bearer {accessToken}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "attemptId": "attempt_id",
    "programName": "IELTS Training",
    "programId": "program_id",
    "timeLimit": 90,
    "totalMarks": 100,
    "totalQuestions": 40,
    "questions": [
      {
        "questionNumber": 1,
        "questionId": "q_id",
        "type": "single-choice",
        "questionText": "What is...?",
        "mark": 5,
        "skillLevel": "beginner",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
      }
    ],
    "attemptsUsed": 1,
    "maxAttempts": 3
  }
}
```

### Submit Quiz
```http
POST /api/attempts/:attemptId/submit
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "q_id",
      "selectedAnswers": [0]
    }
  ],
  "timeTaken": 85
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "attemptId": "attempt_id",
    "score": 85,
    "totalMarks": 100,
    "percentage": 85,
    "passed": true,
    "correctAnswers": 34,
    "incorrectAnswers": 5,
    "skippedAnswers": 1,
    "timeTaken": 85,
    "questionResults": [...]
  }
}
```

### Get Quiz Result
```http
GET /api/attempts/:attemptId
Authorization: Bearer {accessToken}
```

### Get User Attempts
```http
GET /api/attempts/user
Authorization: Bearer {accessToken}

Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - status: in-progress|completed|abandoned (optional)
  - programId: string (optional)
```

### Abandon Quiz
```http
POST /api/attempts/:attemptId/abandon
Authorization: Bearer {accessToken}
```

---

## 🤖 AI Chat

### Create Chat Session
```http
POST /api/ai-chat/session
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "topic": "IELTS Writing",
  "program_id": "program_id",
  "context": "general"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "sessionId": "unique_session_id",
    "topic": "IELTS Writing",
    "remainingChats": 2,
    "subscriptionRequired": false,
    "context": "general",
    "program_id": "program_id"
  }
}
```

### Send Message
```http
POST /api/ai-chat/message
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "sessionId": "session_id",
  "message": "How can I improve my IELTS writing?",
  "skill_level": "beginner",
  "program_id": "program_id"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "messageId": "message_id",
    "aiResponse": "To improve your IELTS writing...",
    "sources": ["source1", "source2"],
    "follow_up_suggestions": ["Ask about task 1", "Practice essays"],
    "metadata": {
      "tokens_used": 150,
      "response_time_ms": 1200,
      "model_used": "gpt-4"
    },
    "remainingChats": 1,
    "timestamp": "2025-12-21T10:30:00Z"
  }
}
```

### Get User Sessions
```http
GET /api/ai-chat/sessions
Authorization: Bearer {accessToken}

Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
```

### Get Session
```http
GET /api/ai-chat/session/:sessionId
Authorization: Bearer {accessToken}
```

### Update Session
```http
PUT /api/ai-chat/session/:sessionId
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Updated Session Title",
  "status": "active"
}
```

### Delete Session
```http
DELETE /api/ai-chat/session/:sessionId
Authorization: Bearer {accessToken}
```

### Submit Feedback
```http
POST /api/ai-chat/session/:sessionId/feedback
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "rating": 5,
  "feedback": "Very helpful!",
  "messageId": "msg_id"
}
```

---

## 👨‍💼 Admin Routes

### Get Dashboard Stats
```http
GET /api/admin/dashboard/stats
Authorization: Bearer {accessToken}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1250,
      "totalPrograms": 45,
      "totalTopics": 12,
      "totalQuizAttempts": 8542,
      "totalAIChats": 3210,
      "activeUsers": 892
    },
    "growth": {
      "newUsersThisWeek": 43,
      "newAttemptsThisWeek": 312
    },
    "recentActivity": {
      "recentAttempts": [...],
      "topPrograms": [...]
    }
  }
}
```

### Get All Users
```http
GET /api/admin/users
Authorization: Bearer {accessToken}

Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - search: string (optional)
  - role: user|admin (default: user)
  - sortBy: createdAt|name|email (default: createdAt)
  - sortOrder: asc|desc (default: desc)
```

### Get All Quiz Attempts
```http
GET /api/admin/attempts
Authorization: Bearer {accessToken}

Query Parameters:
  - page: number
  - limit: number
  - status: string (optional)
  - programId: string (optional)
```

### Update Program Status
```http
PUT /api/admin/programs/:programId/status
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "published"
}
```

### Delete Program
```http
DELETE /api/admin/programs/:programId
Authorization: Bearer {accessToken}
```

### Get Analytics
```http
GET /api/admin/analytics
Authorization: Bearer {accessToken}

Query Parameters:
  - startDate: ISO date (optional)
  - endDate: ISO date (optional)
```

### Bulk Update Programs
```http
PUT /api/admin/programs/bulk
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "programIds": ["id1", "id2"],
  "updates": {
    "status": "published"
  }
}
```

---

## 🎓 Certificates

*Routes exist but not fully implemented yet. Coming soon.*

---

## 💳 Subscriptions

*Routes exist but not fully implemented yet. Coming soon.*

---

## 📝 Request Headers

All authenticated requests require:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

---

## 🔄 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error info (development only)"
}
```

---

## 📊 Question Types

- **single-choice**: Multiple choice with one correct answer
- **multi-choice**: Multiple choice with multiple correct answers
- **text**: Text-based answer
- **fill-in-gap**: Fill in the blank

---

## 🎯 Skill Levels

- beginner
- intermediate
- advanced

---

## 🏷️ Categories

- Technology
- Development
- Marketing
- Financial
- Fitness Train
- Art & Design
- Business
- Lifestyle
- Music
- Design
- Academics
- Health & Fitness
- Productivity
- Accounting

---

## 🔒 Authentication Flow

1. **Register** → Sends OTP to email
2. **Verify OTP** → Completes registration
3. **Login** → Returns access & refresh tokens
4. **Use Access Token** → For all protected routes
5. **Refresh Token** → When access token expires

---

## ⚠️ Rate Limits (Free Users)

- **AI Chat**: 3 conversations per month
- **Quiz Attempts**: Varies by program (typically 3 attempts)

---

## 🚀 Next Steps for Front-End

1. Create an API service file with all these endpoints
2. Set up axios interceptors for token handling
3. Implement error handling and retry logic
4. Add loading states for async operations
5. Store tokens securely (localStorage/sessionStorage)
6. Handle token refresh automatically

---

**Last Updated**: December 21, 2025
**API Version**: 1.0.0
