# 🎯 COMPLETE BACKEND REQUIREMENTS FOR LEARNINGGPT PLATFORM

## 📋 TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [How The Platform Works](#how-the-platform-works)
3. [Complete API Endpoints Required](#complete-api-endpoints-required)
4. [AI Integration Requirements](#ai-integration-requirements)
5. [Database Schema Details](#database-schema-details)
6. [Authentication & Authorization Flow](#authentication--authorization-flow)
7. [Payment Integration](#payment-integration)
8. [File Upload & Storage](#file-upload--storage)
9. [Email & Notifications](#email--notifications)
10. [Implementation Roadmap](#implementation-roadmap)
11. [Testing Requirements](#testing-requirements)

---

## 📖 PROJECT OVERVIEW

**LearninGPT** is an AI-powered learning platform with the following core features:

### Frontend Tech Stack (Current):
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Rich Text**: React Quill (needs upgrade from quill 1.3.7)
- **Animations**: Framer Motion, AOS
- **Icons**: React Icons, Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context + Hooks

### User Types:
1. **Regular Users** (Students/Learners)
2. **Instructors** (Content Creators)
3. **Admins** (Platform Managers)

### Core Features:
1. AI-Powered Chatbot (learning assistant)
2. Learning Programs/Courses
3. Quiz System with Exam Simulator
4. Certificate Generation
5. Subscription/Payment System (3 tiers)
6. Instructor Application & Management
7. Admin Dashboard for content management

---

## 🔄 HOW THE PLATFORM WORKS

### User Journey Flow:

#### 1. **Landing & Registration**
```
User visits homepage 
  ↓
Views pricing plans (Free, Basic $19.99, Premium $39.99)
  ↓
Clicks "Sign Up" 
  ↓
Fills registration form (name, email, password, role)
  ↓
Email verification sent
  ↓
User verifies email
  ↓
Login & JWT token issued
  ↓
Redirected to dashboard
```

#### 2. **Learning Flow (Student)**
```
Student logs in
  ↓
Browses programs by category (Technology, Development, Marketing, etc.)
  ↓
Views program details (overview, pricing, instructor info)
  ↓
Purchases program or subscribes to tier
  ↓
Access granted to:
  - AI Chatbot for Q&A
  - Course documentation
  - Exam simulator/quizzes
  ↓
Takes quizzes → Gets scored
  ↓
Completes program → Receives certificate
  ↓
Can download/verify certificate
```

#### 3. **Instructor Flow**
```
User applies to become instructor
  ↓
Fills application form (bio, expertise, social links)
  ↓
Admin reviews application
  ↓
Approved → Instructor role granted
  ↓
Instructor creates programs:
  - Upload thumbnail
  - Set title, description, category
  - Add rich-text overview (React Quill)
  - Set pricing for each feature (chatbot, docs, exam)
  - Set bundle price
  ↓
Program goes live
  ↓
Instructor sees stats (enrollments, revenue)
```

#### 4. **Admin Flow**
```
Admin logs in
  ↓
Dashboard shows:
  - Total users, instructors, programs, revenue
  - Recent activities
  ↓
Admin can:
  - Create/Edit/Delete programs
  - Create/Edit/Delete quizzes
  - Review instructor applications
  - Manage users (ban, role change)
  - View analytics
  - Generate reports
```

#### 5. **Quiz/Exam System Flow**
```
User selects a topic/program
  ↓
Chooses quiz difficulty (Easy, Medium, Hard)
  ↓
Starts exam simulator
  ↓
Questions displayed one-by-one
  ↓
User selects answers
  ↓
Timer counts down (if timed)
  ↓
Submit quiz
  ↓
Backend calculates score
  ↓
Results shown (score, correct/incorrect answers)
  ↓
If passed → Certificate generated
  ↓
Certificate stored with unique verification code
```

#### 6. **AI Chatbot Flow**
```
User opens AI chat interface
  ↓
Types question about learning topic
  ↓
Frontend sends to backend API
  ↓
Backend calls OpenAI/Mistral API with context:
  - User's enrolled programs
  - Current topic/course content
  - Previous chat history (session-based)
  ↓
AI generates response
  ↓
Response sent back to frontend
  ↓
Displayed in chat interface
  ↓
Conversation saved to database
```

---

## 🛠 COMPLETE API ENDPOINTS REQUIRED

### 1. **AUTHENTICATION ENDPOINTS**

#### `/api/auth/register` - POST
**Purpose**: Register new user
**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePass123",
  "role": "student" // or "instructor"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "userId": "65abc123..."
}
```
**Backend Tasks**:
- Validate input (email format, password strength)
- Check if email already exists
- Hash password with bcrypt
- Create user in MongoDB
- Generate email verification token
- Send verification email
- Return success response

#### `/api/auth/verify-email/:token` - GET
**Purpose**: Verify user email
**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```
**Backend Tasks**:
- Validate token
- Find user by verification token
- Check token expiry
- Update user.isVerified = true
- Clear verification token

#### `/api/auth/login` - POST
**Purpose**: User login
**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```
**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar": "https://...",
    "subscriptionTier": "free"
  }
}
```
**Backend Tasks**:
- Validate input
- Find user by email
- Check if email is verified
- Compare password with bcrypt
- Generate JWT access token (7 days)
- Generate refresh token (30 days)
- Update lastLogin timestamp
- Return tokens + user data

#### `/api/auth/refresh-token` - POST
**Purpose**: Refresh access token
**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Response**:
```json
{
  "success": true,
  "token": "new_access_token...",
  "refreshToken": "new_refresh_token..."
}
```

#### `/api/auth/forgot-password` - POST
**Purpose**: Request password reset
**Request Body**:
```json
{
  "email": "john@example.com"
}
```
**Backend Tasks**:
- Find user by email
- Generate reset token
- Save token with expiry (1 hour)
- Send password reset email with link
- Return success (don't reveal if email exists)

#### `/api/auth/reset-password/:token` - POST
**Purpose**: Reset password with token
**Request Body**:
```json
{
  "password": "newSecurePass123"
}
```
**Backend Tasks**:
- Validate token and expiry
- Hash new password
- Update user password
- Clear reset token
- Send confirmation email

#### `/api/auth/logout` - POST
**Purpose**: Logout user (invalidate refresh token)
**Headers**: `Authorization: Bearer <token>`
**Backend Tasks**:
- Add refresh token to blacklist (Redis/MongoDB)
- Return success

---

### 2. **USER ENDPOINTS**

#### `/api/users/profile` - GET
**Purpose**: Get current user profile
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://cloudinary.../avatar.jpg",
    "role": "student",
    "bio": "Passionate learner...",
    "subscriptionTier": "premium",
    "subscriptionExpiry": "2025-12-31T23:59:59Z",
    "stats": {
      "programsEnrolled": 5,
      "quizzesTaken": 23,
      "certificatesEarned": 3,
      "totalPoints": 1250,
      "streak": 7
    },
    "preferences": {
      "emailNotifications": true,
      "theme": "dark"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### `/api/users/profile` - PUT
**Purpose**: Update user profile
**Headers**: `Authorization: Bearer <token>`
**Request Body** (multipart/form-data):
```json
{
  "name": "John Updated",
  "bio": "New bio...",
  "avatar": "<file>",
  "socialLinks": {
    "twitter": "https://twitter.com/john",
    "linkedin": "https://linkedin.com/in/john"
  }
}
```
**Backend Tasks**:
- Upload avatar to Cloudinary if provided
- Validate input
- Update user document
- Return updated user

#### `/api/users/stats` - GET
**Purpose**: Get user statistics
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "stats": {
    "programsEnrolled": 5,
    "programsCompleted": 2,
    "quizzesTaken": 23,
    "quizzesPassedPercentage": 87.5,
    "certificatesEarned": 3,
    "totalPoints": 1250,
    "currentStreak": 7,
    "longestStreak": 14,
    "learningTimeMinutes": 1200,
    "averageQuizScore": 85.3
  }
}
```

#### `/api/users/enrolled-programs` - GET
**Purpose**: Get user's enrolled programs
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "programs": [
    {
      "id": "prog123...",
      "title": "Full Stack Development",
      "thumbnail": "https://...",
      "progress": 65,
      "enrolledAt": "2024-01-20T10:00:00Z",
      "lastAccessedAt": "2024-12-10T08:30:00Z",
      "instructor": {
        "name": "Jane Smith",
        "avatar": "https://..."
      }
    }
  ]
}
```

#### `/api/users/certificates` - GET
**Purpose**: Get user's certificates
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "certificates": [
    {
      "id": "cert123...",
      "programTitle": "React Mastery",
      "issuedAt": "2024-11-15T10:00:00Z",
      "verificationCode": "CERT-2024-ABC123",
      "certificateUrl": "https://cloudinary.../cert.pdf",
      "shareableLink": "https://learningpt.com/verify/CERT-2024-ABC123"
    }
  ]
}
```

#### `/api/users/change-password` - POST
**Purpose**: Change password for logged-in user
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "currentPassword": "oldPass123",
  "newPassword": "newSecurePass456"
}
```

#### `/api/users/delete-account` - DELETE
**Purpose**: Delete user account
**Headers**: `Authorization: Bearer <token>`
**Backend Tasks**:
- Verify password
- Cancel active subscriptions
- Mark account as deleted (soft delete)
- Schedule data deletion (GDPR compliance)

---

### 3. **PROGRAMS ENDPOINTS**

#### `/api/programs` - GET
**Purpose**: Get all programs (with filters, pagination, search)
**Query Parameters**:
- `page=1` (default 1)
- `limit=12` (default 12)
- `category=Technology` (optional)
- `search=react` (optional)
- `sort=popular` (popular, newest, price-low, price-high)
- `priceMin=0` (optional)
- `priceMax=100` (optional)

**Response**:
```json
{
  "success": true,
  "programs": [
    {
      "id": "prog123...",
      "title": "Full Stack Development Bootcamp",
      "slug": "full-stack-development-bootcamp",
      "description": "Learn MERN stack from scratch",
      "category": "Development",
      "thumbnail": "https://cloudinary.../thumb.jpg",
      "instructor": {
        "id": "inst123...",
        "name": "Jane Smith",
        "avatar": "https://...",
        "expertise": ["React", "Node.js"]
      },
      "pricing": {
        "chatbot": 9.99,
        "documentation": 14.99,
        "examSimulator": 19.99,
        "bundle": 34.99
      },
      "freeQuestionsCount": 5,
      "rating": 4.7,
      "totalReviews": 234,
      "enrolledCount": 1523,
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-12-01T15:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 8,
    "totalPrograms": 95,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### `/api/programs/:id` - GET
**Purpose**: Get single program details
**Response**:
```json
{
  "success": true,
  "program": {
    "id": "prog123...",
    "title": "Full Stack Development Bootcamp",
    "slug": "full-stack-development-bootcamp",
    "description": "Complete description...",
    "overview": "<html>Rich text overview...</html>",
    "category": "Development",
    "thumbnail": "https://...",
    "instructor": {
      "id": "inst123...",
      "name": "Jane Smith",
      "avatar": "https://...",
      "bio": "10+ years experience...",
      "expertise": ["React", "Node.js", "MongoDB"],
      "rating": 4.8,
      "studentsCount": 5000,
      "socialLinks": {
        "twitter": "https://..."
      }
    },
    "pricing": {
      "chatbot": 9.99,
      "documentation": 14.99,
      "examSimulator": 19.99,
      "bundle": 34.99
    },
    "features": [
      "AI-powered chatbot assistance",
      "Comprehensive documentation",
      "Exam simulator with certificates",
      "Lifetime access"
    ],
    "curriculum": [
      {
        "title": "Introduction to React",
        "lessons": 12,
        "duration": "2 hours"
      }
    ],
    "freeQuestionsCount": 5,
    "totalQuestions": 100,
    "rating": 4.7,
    "totalReviews": 234,
    "enrolledCount": 1523,
    "prerequisites": ["Basic JavaScript", "HTML/CSS"],
    "level": "Intermediate",
    "duration": "8 weeks",
    "language": "English",
    "lastUpdated": "2024-12-01T15:30:00Z",
    "createdAt": "2024-01-10T10:00:00Z"
  },
  "isEnrolled": false,
  "userProgress": null
}
```

#### `/api/programs` - POST (Admin/Instructor)
**Purpose**: Create new program
**Headers**: `Authorization: Bearer <token>`
**Request Body** (multipart/form-data):
```json
{
  "title": "Advanced React Patterns",
  "description": "Master advanced React...",
  "overview": "<html>Rich text...</html>",
  "category": "Development",
  "thumbnail": "<file>",
  "pricing": {
    "chatbot": 12.99,
    "documentation": 17.99,
    "examSimulator": 22.99,
    "bundle": 39.99
  },
  "freeQuestionsCount": 3,
  "prerequisites": ["React Basics"],
  "level": "Advanced",
  "duration": "6 weeks"
}
```
**Backend Tasks**:
- Verify user is instructor/admin
- Upload thumbnail to Cloudinary
- Validate pricing
- Create program document
- Return created program

#### `/api/programs/:id` - PUT (Admin/Instructor)
**Purpose**: Update program
**Backend Tasks**:
- Verify ownership (instructor can only edit own programs, admin can edit all)
- Update fields
- Re-upload thumbnail if provided

#### `/api/programs/:id` - DELETE (Admin/Instructor)
**Purpose**: Delete program
**Backend Tasks**:
- Verify ownership
- Soft delete (mark as deleted)
- Handle enrolled users (refund logic?)

#### `/api/programs/:id/enroll` - POST
**Purpose**: Enroll in program
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "accessType": "bundle", // or "chatbot", "documentation", "examSimulator"
  "paymentIntentId": "pi_xxx" // Stripe payment intent ID
}
```
**Backend Tasks**:
- Verify payment
- Check subscription tier access
- Create enrollment record
- Grant access to selected features
- Send confirmation email

#### `/api/programs/:id/progress` - GET
**Purpose**: Get user's progress in program
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "progress": {
    "programId": "prog123...",
    "completionPercentage": 65,
    "lessonsCompleted": 15,
    "lessonsTotal": 23,
    "quizzesTaken": 8,
    "quizzesTotal": 10,
    "timeSpentMinutes": 450,
    "lastAccessedAt": "2024-12-10T10:00:00Z"
  }
}
```

#### `/api/programs/:id/reviews` - GET
**Purpose**: Get program reviews
**Query**: `page=1&limit=10&sort=recent`
**Response**:
```json
{
  "success": true,
  "reviews": [
    {
      "id": "rev123...",
      "user": {
        "name": "Alice Johnson",
        "avatar": "https://..."
      },
      "rating": 5,
      "comment": "Excellent course! Learned a lot.",
      "createdAt": "2024-12-05T14:20:00Z",
      "helpful": 23
    }
  ],
  "averageRating": 4.7,
  "totalReviews": 234
}
```

#### `/api/programs/:id/reviews` - POST
**Purpose**: Add review for program
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "rating": 5,
  "comment": "Great course! Highly recommend."
}
```
**Backend Tasks**:
- Verify user enrolled in program
- Check if user already reviewed
- Create review
- Update program average rating

---

### 4. **QUIZ ENDPOINTS**

#### `/api/quizzes` - GET
**Purpose**: Get all quizzes (admin/instructor)
**Headers**: `Authorization: Bearer <token>`
**Query**: `programId=prog123&difficulty=medium`
**Response**:
```json
{
  "success": true,
  "quizzes": [
    {
      "id": "quiz123...",
      "title": "React Hooks Quiz",
      "programId": "prog123...",
      "programTitle": "React Mastery",
      "difficulty": "medium",
      "questionCount": 20,
      "duration": 30,
      "passingScore": 70,
      "createdAt": "2024-11-15T10:00:00Z"
    }
  ]
}
```

#### `/api/quizzes/:id` - GET
**Purpose**: Get quiz details (without answers)
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "quiz": {
    "id": "quiz123...",
    "title": "React Hooks Quiz",
    "description": "Test your knowledge...",
    "difficulty": "medium",
    "duration": 30,
    "passingScore": 70,
    "questionCount": 20,
    "programId": "prog123...",
    "isTimed": true,
    "allowRetake": true,
    "showAnswersAfterSubmit": false
  }
}
```

#### `/api/quizzes/:id/start` - POST
**Purpose**: Start quiz attempt
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "attemptId": "attempt123...",
  "questions": [
    {
      "id": "q1",
      "questionText": "What is a React Hook?",
      "questionType": "multiple-choice",
      "options": [
        "A JavaScript function",
        "A component",
        "A library",
        "A framework"
      ],
      "points": 5
    }
  ],
  "startedAt": "2024-12-10T10:00:00Z",
  "expiresAt": "2024-12-10T10:30:00Z"
}
```
**Backend Tasks**:
- Check enrollment/access
- Create quiz attempt record
- Shuffle questions (if randomize enabled)
- Return questions without correct answers
- Start timer

#### `/api/quizzes/:id/submit` - POST
**Purpose**: Submit quiz answers
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "attemptId": "attempt123...",
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswer": "A JavaScript function"
    }
  ]
}
```
**Response**:
```json
{
  "success": true,
  "result": {
    "attemptId": "attempt123...",
    "score": 85,
    "totalPoints": 100,
    "scorePercentage": 85,
    "passed": true,
    "correctAnswers": 17,
    "incorrectAnswers": 3,
    "timeTaken": 1200,
    "feedback": [
      {
        "questionId": "q1",
        "isCorrect": true,
        "selectedAnswer": "A JavaScript function",
        "correctAnswer": "A JavaScript function",
        "explanation": "React Hooks are functions..."
      }
    ],
    "certificateGenerated": true,
    "certificateId": "cert123..."
  }
}
```
**Backend Tasks**:
- Validate attempt exists and belongs to user
- Check time limit
- Calculate score
- Compare answers with correct answers
- Determine pass/fail
- If passed and eligible → generate certificate
- Update user stats
- Save attempt record

#### `/api/quizzes` - POST (Admin/Instructor)
**Purpose**: Create quiz
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "title": "Advanced React Quiz",
  "description": "Test advanced concepts...",
  "programId": "prog123...",
  "difficulty": "hard",
  "duration": 45,
  "passingScore": 75,
  "isTimed": true,
  "allowRetake": false,
  "questions": [
    {
      "questionText": "Explain useEffect...",
      "questionType": "multiple-choice",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "B",
      "explanation": "useEffect is...",
      "points": 5
    }
  ]
}
```
**Backend Tasks**:
- Verify ownership
- Validate questions format
- Create quiz document
- Return created quiz

#### `/api/quizzes/:id/attempts` - GET
**Purpose**: Get user's quiz attempts
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "attempts": [
    {
      "id": "attempt123...",
      "quizId": "quiz123...",
      "quizTitle": "React Hooks Quiz",
      "score": 85,
      "passed": true,
      "attemptedAt": "2024-12-10T10:00:00Z",
      "timeTaken": 1200
    }
  ]
}
```

---

### 5. **AI CHATBOT ENDPOINTS**

#### `/api/ai/chat` - POST
**Purpose**: Send message to AI chatbot
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "message": "Explain React hooks in simple terms",
  "programId": "prog123...", // optional: context for AI
  "sessionId": "session123..." // optional: for conversation continuity
}
```
**Response**:
```json
{
  "success": true,
  "response": "React Hooks are functions that let you...",
  "sessionId": "session123...",
  "messageId": "msg123...",
  "timestamp": "2024-12-10T10:00:00Z"
}
```
**Backend Tasks**:
- Verify user subscription/access
- Get user's learning context (enrolled programs, current topic)
- Retrieve conversation history if sessionId provided
- Build AI prompt with context:
  ```
  System: You are a helpful learning assistant for LearninGPT...
  User is studying: Full Stack Development
  Topic: React Hooks
  Previous conversation: [history]
  User question: {message}
  ```
- Call OpenAI/Mistral API
- Save conversation to database
- Return AI response

#### `/api/ai/chat/sessions` - GET
**Purpose**: Get user's chat sessions
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "sessions": [
    {
      "id": "session123...",
      "title": "React Hooks Discussion",
      "programId": "prog123...",
      "messageCount": 12,
      "lastMessageAt": "2024-12-10T10:00:00Z",
      "createdAt": "2024-12-09T14:00:00Z"
    }
  ]
}
```

#### `/api/ai/chat/sessions/:sessionId` - GET
**Purpose**: Get full conversation from session
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "session": {
    "id": "session123...",
    "title": "React Hooks Discussion",
    "messages": [
      {
        "id": "msg1",
        "role": "user",
        "content": "What are React Hooks?",
        "timestamp": "2024-12-10T09:50:00Z"
      },
      {
        "id": "msg2",
        "role": "assistant",
        "content": "React Hooks are...",
        "timestamp": "2024-12-10T09:50:05Z"
      }
    ]
  }
}
```

#### `/api/ai/chat/sessions/:sessionId` - DELETE
**Purpose**: Delete chat session
**Headers**: `Authorization: Bearer <token>`

---

### 6. **CERTIFICATES ENDPOINTS**

#### `/api/certificates/:id` - GET
**Purpose**: Get certificate details
**Response**:
```json
{
  "success": true,
  "certificate": {
    "id": "cert123...",
    "verificationCode": "CERT-2024-ABC123",
    "user": {
      "name": "John Doe",
      "id": "user123..."
    },
    "program": {
      "title": "React Mastery",
      "id": "prog123..."
    },
    "issuedAt": "2024-11-15T10:00:00Z",
    "certificateUrl": "https://cloudinary.../cert.pdf",
    "score": 92,
    "isValid": true
  }
}
```

#### `/api/certificates/verify/:code` - GET
**Purpose**: Verify certificate by verification code
**Response**:
```json
{
  "success": true,
  "isValid": true,
  "certificate": {
    "recipientName": "John Doe",
    "programTitle": "React Mastery",
    "issuedDate": "2024-11-15",
    "verificationCode": "CERT-2024-ABC123"
  }
}
```

#### `/api/certificates/generate` - POST (Internal/Auto)
**Purpose**: Generate certificate (called after quiz pass)
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "userId": "user123...",
  "programId": "prog123...",
  "quizAttemptId": "attempt123...",
  "score": 92
}
```
**Backend Tasks**:
- Validate quiz pass
- Generate unique verification code
- Create certificate PDF (use library like pdfkit)
- Upload to Cloudinary
- Save certificate record
- Send email with certificate

---

### 7. **INSTRUCTOR ENDPOINTS**

#### `/api/instructors/apply` - POST
**Purpose**: Apply to become instructor
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "bio": "I have 10 years of experience...",
  "expertise": ["React", "Node.js", "MongoDB"],
  "experience": "Senior Developer at Tech Corp...",
  "education": "BS Computer Science, MIT",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/jane",
    "twitter": "https://twitter.com/jane",
    "github": "https://github.com/jane"
  },
  "sampleWork": "https://portfolio.com"
}
```
**Backend Tasks**:
- Check if user already applied
- Create instructor application
- Set status to "pending"
- Notify admins via email
- Return application ID

#### `/api/instructors/applications` - GET (Admin)
**Purpose**: Get all instructor applications
**Headers**: `Authorization: Bearer <token>`
**Query**: `status=pending&page=1&limit=10`
**Response**:
```json
{
  "success": true,
  "applications": [
    {
      "id": "app123...",
      "user": {
        "id": "user123...",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "avatar": "https://..."
      },
      "bio": "10 years experience...",
      "expertise": ["React", "Node.js"],
      "status": "pending",
      "appliedAt": "2024-12-01T10:00:00Z"
    }
  ]
}
```

#### `/api/instructors/applications/:id/approve` - POST (Admin)
**Purpose**: Approve instructor application
**Headers**: `Authorization: Bearer <token>`
**Backend Tasks**:
- Find application
- Update user role to "instructor"
- Create instructor profile
- Send approval email
- Update application status to "approved"

#### `/api/instructors/applications/:id/reject` - POST (Admin)
**Purpose**: Reject instructor application
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "reason": "Insufficient experience in teaching..."
}
```
**Backend Tasks**:
- Update application status to "rejected"
- Send rejection email with reason

#### `/api/instructors/:id` - GET
**Purpose**: Get instructor profile
**Response**:
```json
{
  "success": true,
  "instructor": {
    "id": "inst123...",
    "name": "Jane Smith",
    "avatar": "https://...",
    "bio": "Passionate educator...",
    "expertise": ["React", "Node.js", "MongoDB"],
    "rating": 4.8,
    "totalStudents": 5000,
    "totalPrograms": 12,
    "totalReviews": 450,
    "socialLinks": {
      "linkedin": "https://...",
      "twitter": "https://..."
    },
    "joinedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### `/api/instructors/:id/programs` - GET
**Purpose**: Get instructor's programs
**Response**:
```json
{
  "success": true,
  "programs": [/* array of programs */]
}
```

#### `/api/instructors/dashboard` - GET (Instructor)
**Purpose**: Get instructor dashboard stats
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "stats": {
    "totalStudents": 1250,
    "totalRevenue": 45000,
    "totalPrograms": 8,
    "averageRating": 4.7,
    "newEnrollmentsThisMonth": 45,
    "revenueThisMonth": 3500,
    "topPrograms": [
      {
        "id": "prog123...",
        "title": "React Mastery",
        "enrollments": 500,
        "revenue": 15000,
        "rating": 4.9
      }
    ]
  }
}
```

---

### 8. **SUBSCRIPTION/PAYMENT ENDPOINTS**

#### `/api/subscriptions/plans` - GET
**Purpose**: Get available subscription plans
**Response**:
```json
{
  "success": true,
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "features": [
        "Access to free programs",
        "Limited AI chatbot (10 messages/day)",
        "Basic quizzes"
      ],
      "limits": {
        "aiMessages": 10,
        "programs": 5
      }
    },
    {
      "id": "basic",
      "name": "Basic",
      "price": 19.99,
      "billingCycle": "monthly",
      "features": [
        "Unlimited AI chatbot",
        "Access to all basic programs",
        "Exam simulator",
        "Certificates"
      ],
      "limits": {
        "aiMessages": -1,
        "programs": -1
      }
    },
    {
      "id": "premium",
      "name": "Premium",
      "price": 39.99,
      "billingCycle": "monthly",
      "features": [
        "All Basic features",
        "Priority AI responses",
        "Advanced programs",
        "1-on-1 mentorship sessions",
        "Exclusive content"
      ]
    }
  ]
}
```

#### `/api/subscriptions/subscribe` - POST
**Purpose**: Subscribe to a plan
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "planId": "basic",
  "paymentMethodId": "pm_xxx" // Stripe payment method ID
}
```
**Response**:
```json
{
  "success": true,
  "subscription": {
    "id": "sub123...",
    "planId": "basic",
    "status": "active",
    "currentPeriodStart": "2024-12-10T00:00:00Z",
    "currentPeriodEnd": "2025-01-10T00:00:00Z",
    "cancelAtPeriodEnd": false
  },
  "invoice": {
    "id": "inv123...",
    "amount": 19.99,
    "status": "paid",
    "invoiceUrl": "https://..."
  }
}
```
**Backend Tasks**:
- Verify payment method with Stripe
- Create Stripe subscription
- Save subscription to database
- Update user subscriptionTier
- Send confirmation email
- Return subscription details

#### `/api/subscriptions/current` - GET
**Purpose**: Get user's current subscription
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "subscription": {
    "id": "sub123...",
    "planId": "basic",
    "planName": "Basic",
    "status": "active",
    "currentPeriodStart": "2024-12-10T00:00:00Z",
    "currentPeriodEnd": "2025-01-10T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "nextBillingDate": "2025-01-10T00:00:00Z",
    "amount": 19.99
  }
}
```

#### `/api/subscriptions/cancel` - POST
**Purpose**: Cancel subscription
**Headers**: `Authorization: Bearer <token>`
**Backend Tasks**:
- Cancel Stripe subscription
- Set cancelAtPeriodEnd = true
- Send cancellation email
- Don't immediately revoke access (wait until period end)

#### `/api/subscriptions/invoices` - GET
**Purpose**: Get user's invoices/payment history
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "invoices": [
    {
      "id": "inv123...",
      "amount": 19.99,
      "status": "paid",
      "date": "2024-12-10T00:00:00Z",
      "invoiceUrl": "https://stripe.com/invoices/...",
      "downloadUrl": "https://..."
    }
  ]
}
```

#### `/api/payments/create-intent` - POST
**Purpose**: Create Stripe payment intent for one-time purchase
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "programId": "prog123...",
  "accessType": "bundle",
  "amount": 34.99
}
```
**Response**:
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_yyy",
  "paymentIntentId": "pi_xxx"
}
```
**Backend Tasks**:
- Validate program and price
- Create Stripe payment intent
- Return client secret for frontend

#### `/api/payments/webhook` - POST
**Purpose**: Stripe webhook for payment events
**Request Body**: Stripe event payload
**Backend Tasks**:
- Verify webhook signature
- Handle events:
  - `payment_intent.succeeded` → Confirm enrollment
  - `invoice.payment_succeeded` → Renew subscription
  - `customer.subscription.deleted` → Downgrade user
- Update database accordingly

---

### 9. **ADMIN ENDPOINTS**

#### `/api/admin/dashboard` - GET (Admin)
**Purpose**: Get admin dashboard stats
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "stats": {
    "totalUsers": 15000,
    "totalInstructors": 120,
    "totalPrograms": 450,
    "totalRevenue": 250000,
    "activeSubscriptions": 3500,
    "newUsersThisMonth": 450,
    "revenueThisMonth": 35000,
    "chartData": {
      "userGrowth": [/* monthly data */],
      "revenueGrowth": [/* monthly data */]
    }
  }
}
```

#### `/api/admin/users` - GET (Admin)
**Purpose**: Get all users with filters
**Headers**: `Authorization: Bearer <token>`
**Query**: `role=student&status=active&page=1&limit=20&search=john`
**Response**:
```json
{
  "success": true,
  "users": [
    {
      "id": "user123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "subscriptionTier": "basic",
      "status": "active",
      "createdAt": "2024-01-15T10:00:00Z",
      "lastLogin": "2024-12-10T08:00:00Z"
    }
  ],
  "pagination": {/* ... */}
}
```

#### `/api/admin/users/:id/ban` - POST (Admin)
**Purpose**: Ban user
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "reason": "Violation of terms of service"
}
```
**Backend Tasks**:
- Update user status to "banned"
- Revoke access tokens
- Send ban notification email

#### `/api/admin/users/:id/unban` - POST (Admin)
**Purpose**: Unban user

#### `/api/admin/programs/:id/feature` - POST (Admin)
**Purpose**: Feature program on homepage

#### `/api/admin/analytics` - GET (Admin)
**Purpose**: Get detailed analytics
**Query**: `startDate=2024-01-01&endDate=2024-12-31&metric=revenue`
**Response**:
```json
{
  "success": true,
  "analytics": {
    "totalRevenue": 250000,
    "totalEnrollments": 12000,
    "conversionRate": 15.5,
    "topPrograms": [/* ... */],
    "topInstructors": [/* ... */],
    "userRetention": 78.5
  }
}
```

---

### 10. **ADDITIONAL ENDPOINTS**

#### `/api/categories` - GET
**Purpose**: Get all program categories
**Response**:
```json
{
  "success": true,
  "categories": [
    "Technology",
    "Development",
    "Marketing",
    "Financial",
    "Fitness Train",
    "Art & Design"
  ]
}
```

#### `/api/search` - GET
**Purpose**: Global search (programs, instructors)
**Query**: `q=react&type=programs&page=1`
**Response**:
```json
{
  "success": true,
  "results": {
    "programs": [/* ... */],
    "instructors": [/* ... */]
  }
}
```

#### `/api/notifications` - GET
**Purpose**: Get user notifications
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notif123...",
      "type": "enrollment",
      "title": "New student enrolled",
      "message": "John Doe enrolled in your React course",
      "read": false,
      "createdAt": "2024-12-10T09:00:00Z",
      "link": "/programs/prog123"
    }
  ],
  "unreadCount": 3
}
```

#### `/api/notifications/:id/read` - PUT
**Purpose**: Mark notification as read

---

## 🤖 AI INTEGRATION REQUIREMENTS

### AI Provider: OpenAI GPT-4 or Mistral AI

### Implementation Details:

#### 1. **AI Chat System Architecture**
```javascript
// Backend AI Service (backend/services/ai.service.js)
class AIService {
  async generateResponse(userMessage, context) {
    // Build system prompt with learning context
    const systemPrompt = `
      You are an expert learning assistant for LearninGPT platform.
      You help students learn ${context.programTitle}.
      Current topic: ${context.currentTopic}
      Student's level: ${context.userLevel}
      
      Your responses should:
      - Be clear and educational
      - Use analogies and examples
      - Break down complex concepts
      - Encourage learning
      - Provide code examples when relevant
    `;
    
    // Get conversation history
    const conversationHistory = await this.getConversationHistory(
      context.sessionId,
      5 // last 5 messages
    );
    
    // Build messages array for OpenAI
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });
    
    return response.choices[0].message.content;
  }
}
```

#### 2. **Context Building for AI**
- **User Context**: Enrolled programs, current learning path, quiz scores
- **Program Context**: Course content, curriculum, documentation
- **Session Context**: Previous conversation messages (last 5-10)
- **Personalization**: User's learning style, preferences, difficulty level

#### 3. **AI Features to Implement**

**a) Smart Q&A**
- Answer questions about course content
- Explain concepts in different ways
- Provide code examples
- Suggest learning resources

**b) Learning Path Recommendations**
```javascript
async generateLearningPath(userId) {
  // Analyze user's:
  // - Completed programs
  // - Quiz scores
  // - Learning goals
  // - Time spent
  
  // Generate personalized recommendations
  const prompt = `Based on this user profile, suggest next learning steps...`;
  const aiResponse = await openai.chat.completions.create({...});
  
  return parseLearningPath(aiResponse);
}
```

**c) Quiz Question Generation**
```javascript
async generateQuizQuestions(topic, difficulty, count) {
  const prompt = `
    Generate ${count} ${difficulty} level quiz questions about ${topic}.
    Format as JSON array with:
    - questionText
    - options (array of 4)
    - correctAnswer
    - explanation
  `;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

**d) Code Review & Feedback**
```javascript
async reviewCode(code, language, context) {
  const prompt = `
    Review this ${language} code for a student learning ${context.topic}:
    
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Provide:
    1. Correctness assessment
    2. Best practices suggestions
    3. Potential improvements
    4. Learning points
  `;
  
  return await this.generateResponse(prompt, context);
}
```

#### 4. **AI Rate Limiting & Cost Management**

```javascript
// Subscription-based AI limits
const AI_LIMITS = {
  free: {
    messagesPerDay: 10,
    tokensPerMessage: 500
  },
  basic: {
    messagesPerDay: 100,
    tokensPerMessage: 1000
  },
  premium: {
    messagesPerDay: -1, // unlimited
    tokensPerMessage: 2000,
    priorityQueue: true
  }
};

// Middleware to check AI usage limits
async function checkAILimit(req, res, next) {
  const user = req.user;
  const tier = user.subscriptionTier;
  
  const todayUsage = await getAIUsageToday(user.id);
  
  if (todayUsage >= AI_LIMITS[tier].messagesPerDay) {
    return res.status(429).json({
      error: "Daily AI message limit reached. Upgrade for more.",
      upgradeUrl: "/pricing"
    });
  }
  
  next();
}
```

#### 5. **AI Safety & Content Moderation**

```javascript
// Content moderation before sending to AI
async function moderateContent(message) {
  const moderationResponse = await openai.moderations.create({
    input: message
  });
  
  const flagged = moderationResponse.results[0].flagged;
  
  if (flagged) {
    throw new Error("Message contains inappropriate content");
  }
  
  return true;
}
```

#### 6. **AI Response Caching**
```javascript
// Cache common questions to reduce API costs
async function getCachedResponse(question, programId) {
  const cacheKey = `ai:${programId}:${hashQuestion(question)}`;
  
  // Check Redis cache
  const cached = await redis.get(cacheKey);
  if (cached) return cached;
  
  // Generate new response
  const response = await aiService.generateResponse(question);
  
  // Cache for 7 days
  await redis.setex(cacheKey, 7 * 24 * 60 * 60, response);
  
  return response;
}
```

---

## 💾 DATABASE SCHEMA DETAILS

*(Refer to the already created Mongoose models in `/backend/models/` folder)*

### Key Collections:

1. **users** - User accounts, authentication, stats
2. **programs** - Learning programs/courses
3. **quizzes** - Quiz definitions
4. **questions** - Quiz questions (separate for flexibility)
5. **quizAttempts** - User quiz attempts and scores
6. **certificates** - Generated certificates
7. **aiChats** - AI conversation sessions and messages
8. **instructors** - Instructor profiles and applications
9. **subscriptions** - Payment and subscription management
10. **reviews** - Program reviews and ratings
11. **enrollments** - User-program enrollments (can be embedded or separate)
12. **notifications** - User notifications

### Important Relationships:

```
User (1) → (Many) Programs (enrollments)
User (1) → (Many) QuizAttempts
User (1) → (Many) Certificates
User (1) → (Many) AIChatSessions
User (1) → (1) Subscription

Program (1) → (Many) Quizzes
Program (1) → (Many) Reviews
Program (1) → (1) Instructor

Quiz (1) → (Many) Questions
Quiz (1) → (Many) QuizAttempts

Instructor (1) → (Many) Programs
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION FLOW

### Authentication Strategy: JWT (JSON Web Tokens)

#### 1. **Registration Flow**
```
User submits registration form
  ↓
Backend validates input
  ↓
Hash password with bcrypt (salt rounds: 10)
  ↓
Create user in database (isVerified: false)
  ↓
Generate email verification token (JWT, 24h expiry)
  ↓
Send verification email
  ↓
User clicks email link
  ↓
Backend verifies token
  ↓
Update user.isVerified = true
  ↓
User can now login
```

#### 2. **Login Flow**
```
User submits email + password
  ↓
Backend finds user by email
  ↓
Check if email is verified
  ↓
Compare password with bcrypt
  ↓
Generate access token (JWT, 7 days)
  ↓
Generate refresh token (JWT, 30 days)
  ↓
Store refresh token in database/Redis
  ↓
Return both tokens + user data
  ↓
Frontend stores tokens in localStorage
```

#### 3. **JWT Payload Structure**
```javascript
// Access Token
{
  userId: "65abc123...",
  email: "john@example.com",
  role: "student", // or "instructor", "admin"
  subscriptionTier: "basic",
  iat: 1702200000,
  exp: 1702804800 // 7 days later
}

// Refresh Token
{
  userId: "65abc123...",
  tokenId: "unique_token_id",
  type: "refresh",
  iat: 1702200000,
  exp: 1704792000 // 30 days later
}
```

#### 4. **Middleware for Protected Routes**
```javascript
// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Check if user is banned
    if (user.status === 'banned') {
      return res.status(403).json({ error: 'Account is banned' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

#### 5. **Usage in Routes**
```javascript
// Example: Only instructors and admins can create programs
router.post('/programs', 
  authenticate, 
  authorize('instructor', 'admin'), 
  programController.create
);

// Example: Only the user themselves or admin can view profile
router.get('/users/:id/profile',
  authenticate,
  checkOwnershipOrAdmin,
  userController.getProfile
);
```

---

## 💳 PAYMENT INTEGRATION

### Provider: Stripe

#### 1. **Setup**
```javascript
// backend/config/stripe.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
```

#### 2. **Subscription Flow**
```javascript
// backend/controllers/subscription.controller.js

// Create subscription
async subscribe(req, res) {
  const { planId, paymentMethodId } = req.body;
  const user = req.user;
  
  try {
    // Get plan details
    const plan = SUBSCRIPTION_PLANS[planId];
    
    // Create or get Stripe customer
    let stripeCustomer = user.stripeCustomerId;
    
    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
      
      stripeCustomer = customer.id;
      user.stripeCustomerId = stripeCustomer;
      await user.save();
    }
    
    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomer,
      items: [{ price: plan.stripePriceId }],
      expand: ['latest_invoice.payment_intent']
    });
    
    // Save subscription to database
    const newSubscription = await Subscription.create({
      userId: user._id,
      planId: planId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      amount: plan.price
    });
    
    // Update user subscription tier
    user.subscriptionTier = planId;
    user.subscriptionExpiry = new Date(subscription.current_period_end * 1000);
    await user.save();
    
    res.json({
      success: true,
      subscription: newSubscription
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
}
```

#### 3. **One-Time Payment (Program Purchase)**
```javascript
async createPaymentIntent(req, res) {
  const { programId, accessType } = req.body;
  const user = req.user;
  
  // Get program and calculate amount
  const program = await Program.findById(programId);
  const amount = program.pricing[accessType];
  
  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    customer: user.stripeCustomerId,
    metadata: {
      userId: user._id.toString(),
      programId: programId,
      accessType: accessType
    }
  });
  
  res.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  });
}
```

#### 4. **Webhook Handler**
```javascript
// backend/routes/webhook.routes.js
const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');

router.post('/stripe', 
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle events
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;
        
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handleInvoicePayment(invoice);
        break;
        
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleSubscriptionCanceled(subscription);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  }
);

async function handlePaymentSuccess(paymentIntent) {
  const { userId, programId, accessType } = paymentIntent.metadata;
  
  // Create enrollment
  await Enrollment.create({
    userId,
    programId,
    accessType,
    paymentId: paymentIntent.id,
    amount: paymentIntent.amount / 100
  });
  
  // Send confirmation email
  await sendEnrollmentEmail(userId, programId);
}

module.exports = router;
```

---

## 📁 FILE UPLOAD & STORAGE

### Provider: Cloudinary

#### 1. **Setup**
```javascript
// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
```

#### 2. **Upload Middleware**
```javascript
// backend/middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});

module.exports = upload;
```

#### 3. **Upload Service**
```javascript
// backend/services/upload.service.js
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

class UploadService {
  async uploadImage(fileBuffer, folder = 'general') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `learninggpt/${folder}`,
          resource_type: 'auto',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error,// filepath: /home/root_coder/Desktop/roumsy-landing-page/BACKEND_REQUIREMENTS.md
# 🎯 COMPLETE BACKEND REQUIREMENTS FOR LEARNINGGPT PLATFORM

## 📋 TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [How The Platform Works](#how-the-platform-works)
3. [Complete API Endpoints Required](#complete-api-endpoints-required)
4. [AI Integration Requirements](#ai-integration-requirements)
5. [Database Schema Details](#database-schema-details)
6. [Authentication & Authorization Flow](#authentication--authorization-flow)
7. [Payment Integration](#payment-integration)
8. [File Upload & Storage](#file-upload--storage)
9. [Email & Notifications](#email--notifications)
10. [Implementation Roadmap](#implementation-roadmap)
11. [Testing Requirements](#testing-requirements)

---

## 📖 PROJECT OVERVIEW

**LearninGPT** is an AI-powered learning platform with the following core features:

### Frontend Tech Stack (Current):
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Rich Text**: React Quill (needs upgrade from quill 1.3.7)
- **Animations**: Framer Motion, AOS
- **Icons**: React Icons, Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context + Hooks

### User Types:
1. **Regular Users** (Students/Learners)
2. **Instructors** (Content Creators)
3. **Admins** (Platform Managers)

### Core Features:
1. AI-Powered Chatbot (learning assistant)
2. Learning Programs/Courses
3. Quiz System with Exam Simulator
4. Certificate Generation
5. Subscription/Payment System (3 tiers)
6. Instructor Application & Management
7. Admin Dashboard for content management

---

## 🔄 HOW THE PLATFORM WORKS

### User Journey Flow:

#### 1. **Landing & Registration**
```
User visits homepage 
  ↓
Views pricing plans (Free, Basic $19.99, Premium $39.99)
  ↓
Clicks "Sign Up" 
  ↓
Fills registration form (name, email, password, role)
  ↓
Email verification sent
  ↓
User verifies email
  ↓
Login & JWT token issued
  ↓
Redirected to dashboard
```

#### 2. **Learning Flow (Student)**
```
Student logs in
  ↓
Browses programs by category (Technology, Development, Marketing, etc.)
  ↓
Views program details (overview, pricing, instructor info)
  ↓
Purchases program or subscribes to tier
  ↓
Access granted to:
  - AI Chatbot for Q&A
  - Course documentation
  - Exam simulator/quizzes
  ↓
Takes quizzes → Gets scored
  ↓
Completes program → Receives certificate
  ↓
Can download/verify certificate
```

#### 3. **Instructor Flow**
```
User applies to become instructor
  ↓
Fills application form (bio, expertise, social links)
  ↓
Admin reviews application
  ↓
Approved → Instructor role granted
  ↓
Instructor creates programs:
  - Upload thumbnail
  - Set title, description, category
  - Add rich-text overview (React Quill)
  - Set pricing for each feature (chatbot, docs, exam)
  - Set bundle price
  ↓
Program goes live
  ↓
Instructor sees stats (enrollments, revenue)
```

#### 4. **Admin Flow**
```
Admin logs in
  ↓
Dashboard shows:
  - Total users, instructors, programs, revenue
  - Recent activities
  ↓
Admin can:
  - Create/Edit/Delete programs
  - Create/Edit/Delete quizzes
  - Review instructor applications
  - Manage users (ban, role change)
  - View analytics
  - Generate reports
```

#### 5. **Quiz/Exam System Flow**
```
User selects a topic/program
  ↓
Chooses quiz difficulty (Easy, Medium, Hard)
  ↓
Starts exam simulator
  ↓
Questions displayed one-by-one
  ↓
User selects answers
  ↓
Timer counts down (if timed)
  ↓
Submit quiz
  ↓
Backend calculates score
  ↓
Results shown (score, correct/incorrect answers)
  ↓
If passed → Certificate generated
  ↓
Certificate stored with unique verification code
```

#### 6. **AI Chatbot Flow**
```
User opens AI chat interface
  ↓
Types question about learning topic
  ↓
Frontend sends to backend API
  ↓
Backend calls OpenAI/Mistral API with context:
  - User's enrolled programs
  - Current topic/course content
  - Previous chat history (session-based)
  ↓
AI generates response
  ↓
Response sent back to frontend
  ↓
Displayed in chat interface
  ↓
Conversation saved to database
```

---

## 🛠 COMPLETE API ENDPOINTS REQUIRED

### 1. **AUTHENTICATION ENDPOINTS**

#### `/api/auth/register` - POST
**Purpose**: Register new user
**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePass123",
  "role": "student" // or "instructor"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "userId": "65abc123..."
}
```
**Backend Tasks**:
- Validate input (email format, password strength)
- Check if email already exists
- Hash password with bcrypt
- Create user in MongoDB
- Generate email verification token
- Send verification email
- Return success response

#### `/api/auth/verify-email/:token` - GET
**Purpose**: Verify user email
**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```
**Backend Tasks**:
- Validate token
- Find user by verification token
- Check token expiry
- Update user.isVerified = true
- Clear verification token

#### `/api/auth/login` - POST
**Purpose**: User login
**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```
**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar": "https://...",
    "subscriptionTier": "free"
  }
}
```
**Backend Tasks**:
- Validate input
- Find user by email
- Check if email is verified
- Compare password with bcrypt
- Generate JWT access token (7 days)
- Generate refresh token (30 days)
- Update lastLogin timestamp
- Return tokens + user data

#### `/api/auth/refresh-token` - POST
**Purpose**: Refresh access token
**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Response**:
```json
{
  "success": true,
  "token": "new_access_token...",
  "refreshToken": "new_refresh_token..."
}
```

#### `/api/auth/forgot-password` - POST
**Purpose**: Request password reset
**Request Body**:
```json
{
  "email": "john@example.com"
}
```
**Backend Tasks**:
- Find user by email
- Generate reset token
- Save token with expiry (1 hour)
- Send password reset email with link
- Return success (don't reveal if email exists)

#### `/api/auth/reset-password/:token` - POST
**Purpose**: Reset password with token
**Request Body**:
```json
{
  "password": "newSecurePass123"
}
```
**Backend Tasks**:
- Validate token and expiry
- Hash new password
- Update user password
- Clear reset token
- Send confirmation email

#### `/api/auth/logout` - POST
**Purpose**: Logout user (invalidate refresh token)
**Headers**: `Authorization: Bearer <token>`
**Backend Tasks**:
- Add refresh token to blacklist (Redis/MongoDB)
- Return success

---

### 2. **USER ENDPOINTS**

#### `/api/users/profile` - GET
**Purpose**: Get current user profile
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://cloudinary.../avatar.jpg",
    "role": "student",
    "bio": "Passionate learner...",
    "subscriptionTier": "premium",
    "subscriptionExpiry": "2025-12-31T23:59:59Z",
    "stats": {
      "programsEnrolled": 5,
      "quizzesTaken": 23,
      "certificatesEarned": 3,
      "totalPoints": 1250,
      "streak": 7
    },
    "preferences": {
      "emailNotifications": true,
      "theme": "dark"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### `/api/users/profile` - PUT
**Purpose**: Update user profile
**Headers**: `Authorization: Bearer <token>`
**Request Body** (multipart/form-data):
```json
{
  "name": "John Updated",
  "bio": "New bio...",
  "avatar": "<file>",
  "socialLinks": {
    "twitter": "https://twitter.com/john",
    "linkedin": "https://linkedin.com/in/john"
  }
}
```
**Backend Tasks**:
- Upload avatar to Cloudinary if provided
- Validate input
- Update user document
- Return updated user

#### `/api/users/stats` - GET
**Purpose**: Get user statistics
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "stats": {
    "programsEnrolled": 5,
    "programsCompleted": 2,
    "quizzesTaken": 23,
    "quizzesPassedPercentage": 87.5,
    "certificatesEarned": 3,
    "totalPoints": 1250,
    "currentStreak": 7,
    "longestStreak": 14,
    "learningTimeMinutes": 1200,
    "averageQuizScore": 85.3
  }
}
```

#### `/api/users/enrolled-programs` - GET
**Purpose**: Get user's enrolled programs
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "programs": [
    {
      "id": "prog123...",
      "title": "Full Stack Development",
      "thumbnail": "https://...",
      "progress": 65,
      "enrolledAt": "2024-01-20T10:00:00Z",
      "lastAccessedAt": "2024-12-10T08:30:00Z",
      "instructor": {
        "name": "Jane Smith",
        "avatar": "https://..."
      }
    }
  ]
}
```

#### `/api/users/certificates` - GET
**Purpose**: Get user's certificates
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "certificates": [
    {
      "id": "cert123...",
      "programTitle": "React Mastery",
      "issuedAt": "2024-11-15T10:00:00Z",
      "verificationCode": "CERT-2024-ABC123",
      "certificateUrl": "https://cloudinary.../cert.pdf",
      "shareableLink": "https://learningpt.com/verify/CERT-2024-ABC123"
    }
  ]
}
```

#### `/api/users/change-password` - POST
**Purpose**: Change password for logged-in user
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "currentPassword": "oldPass123",
  "newPassword": "newSecurePass456"
}
```

#### `/api/users/delete-account` - DELETE
**Purpose**: Delete user account
**Headers**: `Authorization: Bearer <token>`
**Backend Tasks**:
- Verify password
- Cancel active subscriptions
- Mark account as deleted (soft delete)
- Schedule data deletion (GDPR compliance)

---

### 3. **PROGRAMS ENDPOINTS**

#### `/api/programs` - GET
**Purpose**: Get all programs (with filters, pagination, search)
**Query Parameters**:
- `page=1` (default 1)
- `limit=12` (default 12)
- `category=Technology` (optional)
- `search=react` (optional)
- `sort=popular` (popular, newest, price-low, price-high)
- `priceMin=0` (optional)
- `priceMax=100` (optional)

**Response**:
```json
{
  "success": true,
  "programs": [
    {
      "id": "prog123...",
      "title": "Full Stack Development Bootcamp",
      "slug": "full-stack-development-bootcamp",
      "description": "Learn MERN stack from scratch",
      "category": "Development",
      "thumbnail": "https://cloudinary.../thumb.jpg",
      "instructor": {
        "id": "inst123...",
        "name": "Jane Smith",
        "avatar": "https://...",
        "expertise": ["React", "Node.js"]
      },
      "pricing": {
        "chatbot": 9.99,
        "documentation": 14.99,
        "examSimulator": 19.99,
        "bundle": 34.99
      },
      "freeQuestionsCount": 5,
      "rating": 4.7,
      "totalReviews": 234,
      "enrolledCount": 1523,
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-12-01T15:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 8,
    "totalPrograms": 95,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### `/api/programs/:id` - GET
**Purpose**: Get single program details
**Response**:
```json
{
  "success": true,
  "program": {
    "id": "prog123...",
    "title": "Full Stack Development Bootcamp",
    "slug": "full-stack-development-bootcamp",
    "description": "Complete description...",
    "overview": "<html>Rich text overview...</html>",
    "category": "Development",
    "thumbnail": "https://...",
    "instructor": {
      "id": "inst123...",
      "name": "Jane Smith",
      "avatar": "https://...",
      "bio": "10+ years experience...",
      "expertise": ["React", "Node.js", "MongoDB"],
      "rating": 4.8,
      "studentsCount": 5000,
      "socialLinks": {
        "twitter": "https://..."
      }
    },
    "pricing": {
      "chatbot": 9.99,
      "documentation": 14.99,
      "examSimulator": 19.99,
      "bundle": 34.99
    },
    "features": [
      "AI-powered chatbot assistance",
      "Comprehensive documentation",
      "Exam simulator with certificates",
      "Lifetime access"
    ],
    "curriculum": [
      {
        "title": "Introduction to React",
        "lessons": 12,
        "duration": "2 hours"
      }
    ],
    "freeQuestionsCount": 5,
    "totalQuestions": 100,
    "rating": 4.7,
    "totalReviews": 234,
    "enrolledCount": 1523,
    "prerequisites": ["Basic JavaScript", "HTML/CSS"],
    "level": "Intermediate",
    "duration": "8 weeks",
    "language": "English",
    "lastUpdated": "2024-12-01T15:30:00Z",
    "createdAt": "2024-01-10T10:00:00Z"
  },
  "isEnrolled": false,
  "userProgress": null
}
```

#### `/api/programs` - POST (Admin/Instructor)
**Purpose**: Create new program
**Headers**: `Authorization: Bearer <token>`
**Request Body** (multipart/form-data):
```json
{
  "title": "Advanced React Patterns",
  "description": "Master advanced React...",
  "overview": "<html>Rich text...</html>",
  "category": "Development",
  "thumbnail": "<file>",
  "pricing": {
    "chatbot": 12.99,
    "documentation": 17.99,
    "examSimulator": 22.99,
    "bundle": 39.99
  },
  "freeQuestionsCount": 3,
  "prerequisites": ["React Basics"],
  "level": "Advanced",
  "duration": "6 weeks"
}
```
**Backend Tasks**:
- Verify user is instructor/admin
- Upload thumbnail to Cloudinary
- Validate pricing
- Create program document
- Return created program

#### `/api/programs/:id` - PUT (Admin/Instructor)
**Purpose**: Update program
**Backend Tasks**:
- Verify ownership (instructor can only edit own programs, admin can edit all)
- Update fields
- Re-upload thumbnail if provided

#### `/api/programs/:id` - DELETE (Admin/Instructor)
**Purpose**: Delete program
**Backend Tasks**:
- Verify ownership
- Soft delete (mark as deleted)
- Handle enrolled users (refund logic?)

#### `/api/programs/:id/enroll` - POST
**Purpose**: Enroll in program
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "accessType": "bundle", // or "chatbot", "documentation", "examSimulator"
  "paymentIntentId": "pi_xxx" // Stripe payment intent ID
}
```
**Backend Tasks**:
- Verify payment
- Check subscription tier access
- Create enrollment record
- Grant access to selected features
- Send confirmation email

#### `/api/programs/:id/progress` - GET
**Purpose**: Get user's progress in program
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "progress": {
    "programId": "prog123...",
    "completionPercentage": 65,
    "lessonsCompleted": 15,
    "lessonsTotal": 23,
    "quizzesTaken": 8,
    "quizzesTotal": 10,
    "timeSpentMinutes": 450,
    "lastAccessedAt": "2024-12-10T10:00:00Z"
  }
}
```

#### `/api/programs/:id/reviews` - GET
**Purpose**: Get program reviews
**Query**: `page=1&limit=10&sort=recent`
**Response**:
```json
{
  "success": true,
  "reviews": [
    {
      "id": "rev123...",
      "user": {
        "name": "Alice Johnson",
        "avatar": "https://..."
      },
      "rating": 5,
      "comment": "Excellent course! Learned a lot.",
      "createdAt": "2024-12-05T14:20:00Z",
      "helpful": 23
    }
  ],
  "averageRating": 4.7,
  "totalReviews": 234
}
```

#### `/api/programs/:id/reviews` - POST
**Purpose**: Add review for program
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "rating": 5,
  "comment": "Great course! Highly recommend."
}
```
**Backend Tasks**:
- Verify user enrolled in program
- Check if user already reviewed
- Create review
- Update program average rating

---

### 4. **QUIZ ENDPOINTS**

#### `/api/quizzes` - GET
**Purpose**: Get all quizzes (admin/instructor)
**Headers**: `Authorization: Bearer <token>`
**Query**: `programId=prog123&difficulty=medium`
**Response**:
```json
{
  "success": true,
  "quizzes": [
    {
      "id": "quiz123...",
      "title": "React Hooks Quiz",
      "programId": "prog123...",
      "programTitle": "React Mastery",
      "difficulty": "medium",
      "questionCount": 20,
      "duration": 30,
      "passingScore": 70,
      "createdAt": "2024-11-15T10:00:00Z"
    }
  ]
}
```

#### `/api/quizzes/:id` - GET
**Purpose**: Get quiz details (without answers)
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "quiz": {
    "id": "quiz123...",
    "title": "React Hooks Quiz",
    "description": "Test your knowledge...",
    "difficulty": "medium",
    "duration": 30,
    "passingScore": 70,
    "questionCount": 20,
    "programId": "prog123...",
    "isTimed": true,
    "allowRetake": true,
    "showAnswersAfterSubmit": false
  }
}
```

#### `/api/quizzes/:id/start` - POST
**Purpose**: Start quiz attempt
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "attemptId": "attempt123...",
  "questions": [
    {
      "id": "q1",
      "questionText": "What is a React Hook?",
      "questionType": "multiple-choice",
      "options": [
        "A JavaScript function",
        "A component",
        "A library",
        "A framework"
      ],
      "points": 5
    }
  ],
  "startedAt": "2024-12-10T10:00:00Z",
  "expiresAt": "2024-12-10T10:30:00Z"
}
```
**Backend Tasks**:
- Check enrollment/access
- Create quiz attempt record
- Shuffle questions (if randomize enabled)
- Return questions without correct answers
- Start timer

#### `/api/quizzes/:id/submit` - POST
**Purpose**: Submit quiz answers
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "attemptId": "attempt123...",
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswer": "A JavaScript function"
    }
  ]
}
```
**Response**:
```json
{
  "success": true,
  "result": {
    "attemptId": "attempt123...",
    "score": 85,
    "totalPoints": 100,
    "scorePercentage": 85,
    "passed": true,
    "correctAnswers": 17,
    "incorrectAnswers": 3,
    "timeTaken": 1200,
    "feedback": [
      {
        "questionId": "q1",
        "isCorrect": true,
        "selectedAnswer": "A JavaScript function",
        "correctAnswer": "A JavaScript function",
        "explanation": "React Hooks are functions..."
      }
    ],
    "certificateGenerated": true,
    "certificateId": "cert123..."
  }
}
```
**Backend Tasks**:
- Validate attempt exists and belongs to user
- Check time limit
- Calculate score
- Compare answers with correct answers
- Determine pass/fail
- If passed and eligible → generate certificate
- Update user stats
- Save attempt record

#### `/api/quizzes` - POST (Admin/Instructor)
**Purpose**: Create quiz
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "title": "Advanced React Quiz",
  "description": "Test advanced concepts...",
  "programId": "prog123...",
  "difficulty": "hard",
  "duration": 45,
  "passingScore": 75,
  "isTimed": true,
  "allowRetake": false,
  "questions": [
    {
      "questionText": "Explain useEffect...",
      "questionType": "multiple-choice",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "B",
      "explanation": "useEffect is...",
      "points": 5
    }
  ]
}
```
**Backend Tasks**:
- Verify ownership
- Validate questions format
- Create quiz document
- Return created quiz

#### `/api/quizzes/:id/attempts` - GET
**Purpose**: Get user's quiz attempts
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "attempts": [
    {
      "id": "attempt123...",
      "quizId": "quiz123...",
      "quizTitle": "React Hooks Quiz",
      "score": 85,
      "passed": true,
      "attemptedAt": "2024-12-10T10:00:00Z",
      "timeTaken": 1200
    }
  ]
}
```

---

### 5. **AI CHATBOT ENDPOINTS**

#### `/api/ai/chat` - POST
**Purpose**: Send message to AI chatbot
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "message": "Explain React hooks in simple terms",
  "programId": "prog123...", // optional: context for AI
  "sessionId": "session123..." // optional: for conversation continuity
}
```
**Response**:
```json
{
  "success": true,
  "response": "React Hooks are functions that let you...",
  "sessionId": "session123...",
  "messageId": "msg123...",
  "timestamp": "2024-12-10T10:00:00Z"
}
```
**Backend Tasks**:
- Verify user subscription/access
- Get user's learning context (enrolled programs, current topic)
- Retrieve conversation history if sessionId provided
- Build AI prompt with context:
  ```
  System: You are a helpful learning assistant for LearninGPT...
  User is studying: Full Stack Development
  Topic: React Hooks
  Previous conversation: [history]
  User question: {message}
  ```
- Call OpenAI/Mistral API
- Save conversation to database
- Return AI response

#### `/api/ai/chat/sessions` - GET
**Purpose**: Get user's chat sessions
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "sessions": [
    {
      "id": "session123...",
      "title": "React Hooks Discussion",
      "programId": "prog123...",
      "messageCount": 12,
      "lastMessageAt": "2024-12-10T10:00:00Z",
      "createdAt": "2024-12-09T14:00:00Z"
    }
  ]
}
```

#### `/api/ai/chat/sessions/:sessionId` - GET
**Purpose**: Get full conversation from session
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "session": {
    "id": "session123...",
    "title": "React Hooks Discussion",
    "messages": [
      {
        "id": "msg1",
        "role": "user",
        "content": "What are React Hooks?",
        "timestamp": "2024-12-10T09:50:00Z"
      },
      {
        "id": "msg2",
        "role": "assistant",
        "content": "React Hooks are...",
        "timestamp": "2024-12-10T09:50:05Z"
      }
    ]
  }
}
```

#### `/api/ai/chat/sessions/:sessionId` - DELETE
**Purpose**: Delete chat session
**Headers**: `Authorization: Bearer <token>`

---

### 6. **CERTIFICATES ENDPOINTS**

#### `/api/certificates/:id` - GET
**Purpose**: Get certificate details
**Response**:
```json
{
  "success": true,
  "certificate": {
    "id": "cert123...",
    "verificationCode": "CERT-2024-ABC123",
    "user": {
      "name": "John Doe",
      "id": "user123..."
    },
    "program": {
      "title": "React Mastery",
      "id": "prog123..."
    },
    "issuedAt": "2024-11-15T10:00:00Z",
    "certificateUrl": "https://cloudinary.../cert.pdf",
    "score": 92,
    "isValid": true
  }
}
```

#### `/api/certificates/verify/:code` - GET
**Purpose**: Verify certificate by verification code
**Response**:
```json
{
  "success": true,
  "isValid": true,
  "certificate": {
    "recipientName": "John Doe",
    "programTitle": "React Mastery",
    "issuedDate": "2024-11-15",
    "verificationCode": "CERT-2024-ABC123"
  }
}
```

#### `/api/certificates/generate` - POST (Internal/Auto)
**Purpose**: Generate certificate (called after quiz pass)
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "userId": "user123...",
  "programId": "prog123...",
  "quizAttemptId": "attempt123...",
  "score": 92
}
```
**Backend Tasks**:
- Validate quiz pass
- Generate unique verification code
- Create certificate PDF (use library like pdfkit)
- Upload to Cloudinary
- Save certificate record
- Send email with certificate

---

### 7. **INSTRUCTOR ENDPOINTS**

#### `/api/instructors/apply` - POST
**Purpose**: Apply to become instructor
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "bio": "I have 10 years of experience...",
  "expertise": ["React", "Node.js", "MongoDB"],
  "experience": "Senior Developer at Tech Corp...",
  "education": "BS Computer Science, MIT",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/jane",
    "twitter": "https://twitter.com/jane",
    "github": "https://github.com/jane"
  },
  "sampleWork": "https://portfolio.com"
}
```
**Backend Tasks**:
- Check if user already applied
- Create instructor application
- Set status to "pending"
- Notify admins via email
- Return application ID

#### `/api/instructors/applications` - GET (Admin)
**Purpose**: Get all instructor applications
**Headers**: `Authorization: Bearer <token>`
**Query**: `status=pending&page=1&limit=10`
**Response**:
```json
{
  "success": true,
  "applications": [
    {
      "id": "app123...",
      "user": {
        "id": "user123...",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "avatar": "https://..."
      },
      "bio": "10 years experience...",
      "expertise": ["React", "Node.js"],
      "status": "pending",
      "appliedAt": "2024-12-01T10:00:00Z"
    }
  ]
}
```

#### `/api/instructors/applications/:id/approve` - POST (Admin)
**Purpose**: Approve instructor application
**Headers**: `Authorization: Bearer <token>`
**Backend Tasks**:
- Find application
- Update user role to "instructor"
- Create instructor profile
- Send approval email
- Update application status to "approved"

#### `/api/instructors/applications/:id/reject` - POST (Admin)
**Purpose**: Reject instructor application
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "reason": "Insufficient experience in teaching..."
}
```
**Backend Tasks**:
- Update application status to "rejected"
- Send rejection email with reason

#### `/api/instructors/:id` - GET
**Purpose**: Get instructor profile
**Response**:
```json
{
  "success": true,
  "instructor": {
    "id": "inst123...",
    "name": "Jane Smith",
    "avatar": "https://...",
    "bio": "Passionate educator...",
    "expertise": ["React", "Node.js", "MongoDB"],
    "rating": 4.8,
    "totalStudents": 5000,
    "totalPrograms": 12,
    "totalReviews": 450,
    "socialLinks": {
      "linkedin": "https://...",
      "twitter": "https://..."
    },
    "joinedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### `/api/instructors/:id/programs` - GET
**Purpose**: Get instructor's programs
**Response**:
```json
{
  "success": true,
  "programs": [/* array of programs */]
}
```

#### `/api/instructors/dashboard` - GET (Instructor)
**Purpose**: Get instructor dashboard stats
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "stats": {
    "totalStudents": 1250,
    "totalRevenue": 45000,
    "totalPrograms": 8,
    "averageRating": 4.7,
    "newEnrollmentsThisMonth": 45,
    "revenueThisMonth": 3500,
    "topPrograms": [
      {
        "id": "prog123...",
        "title": "React Mastery",
        "enrollments": 500,
        "revenue": 15000,
        "rating": 4.9
      }
    ]
  }
}
```

---

### 8. **SUBSCRIPTION/PAYMENT ENDPOINTS**

#### `/api/subscriptions/plans` - GET
**Purpose**: Get available subscription plans
**Response**:
```json
{
  "success": true,
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "features": [
        "Access to free programs",
        "Limited AI chatbot (10 messages/day)",
        "Basic quizzes"
      ],
      "limits": {
        "aiMessages": 10,
        "programs": 5
      }
    },
    {
      "id": "basic",
      "name": "Basic",
      "price": 19.99,
      "billingCycle": "monthly",
      "features": [
        "Unlimited AI chatbot",
        "Access to all basic programs",
        "Exam simulator",
        "Certificates"
      ],
      "limits": {
        "aiMessages": -1,
        "programs": -1
      }
    },
    {
      "id": "premium",
      "name": "Premium",
      "price": 39.99,
      "billingCycle": "monthly",
      "features": [
        "All Basic features",
        "Priority AI responses",
        "Advanced programs",
        "1-on-1 mentorship sessions",
        "Exclusive content"
      ]
    }
  ]
}
```

#### `/api/subscriptions/subscribe` - POST
**Purpose**: Subscribe to a plan
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "planId": "basic",
  "paymentMethodId": "pm_xxx" // Stripe payment method ID
}
```
**Response**:
```json
{
  "success": true,
  "subscription": {
    "id": "sub123...",
    "planId": "basic",
    "status": "active",
    "currentPeriodStart": "2024-12-10T00:00:00Z",
    "currentPeriodEnd": "2025-01-10T00:00:00Z",
    "cancelAtPeriodEnd": false
  },
  "invoice": {
    "id": "inv123...",
    "amount": 19.99,
    "status": "paid",
    "invoiceUrl": "https://..."
  }
}
```
**Backend Tasks**:
- Verify payment method with Stripe
- Create Stripe subscription
- Save subscription to database
- Update user subscriptionTier
- Send confirmation email
- Return subscription details

#### `/api/subscriptions/current` - GET
**Purpose**: Get user's current subscription
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "subscription": {
    "id": "sub123...",
    "planId": "basic",
    "planName": "Basic",
    "status": "active",
    "currentPeriodStart": "2024-12-10T00:00:00Z",
    "currentPeriodEnd": "2025-01-10T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "nextBillingDate": "2025-01-10T00:00:00Z",
    "amount": 19.99
  }
}
```

#### `/api/subscriptions/cancel` - POST
**Purpose**: Cancel subscription
**Headers**: `Authorization: Bearer <token>`
**Backend Tasks**:
- Cancel Stripe subscription
- Set cancelAtPeriodEnd = true
- Send cancellation email
- Don't immediately revoke access (wait until period end)

#### `/api/subscriptions/invoices` - GET
**Purpose**: Get user's invoices/payment history
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "invoices": [
    {
      "id": "inv123...",
      "amount": 19.99,
      "status": "paid",
      "date": "2024-12-10T00:00:00Z",
      "invoiceUrl": "https://stripe.com/invoices/...",
      "downloadUrl": "https://..."
    }
  ]
}
```

#### `/api/payments/create-intent` - POST
**Purpose**: Create Stripe payment intent for one-time purchase
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "programId": "prog123...",
  "accessType": "bundle",
  "amount": 34.99
}
```
**Response**:
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_yyy",
  "paymentIntentId": "pi_xxx"
}
```
**Backend Tasks**:
- Validate program and price
- Create Stripe payment intent
- Return client secret for frontend

#### `/api/payments/webhook` - POST
**Purpose**: Stripe webhook for payment events
**Request Body**: Stripe event payload
**Backend Tasks**:
- Verify webhook signature
- Handle events:
  - `payment_intent.succeeded` → Confirm enrollment
  - `invoice.payment_succeeded` → Renew subscription
  - `customer.subscription.deleted` → Downgrade user
- Update database accordingly

---

### 9. **ADMIN ENDPOINTS**

#### `/api/admin/dashboard` - GET (Admin)
**Purpose**: Get admin dashboard stats
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "stats": {
    "totalUsers": 15000,
    "totalInstructors": 120,
    "totalPrograms": 450,
    "totalRevenue": 250000,
    "activeSubscriptions": 3500,
    "newUsersThisMonth": 450,
    "revenueThisMonth": 35000,
    "chartData": {
      "userGrowth": [/* monthly data */],
      "revenueGrowth": [/* monthly data */]
    }
  }
}
```

#### `/api/admin/users` - GET (Admin)
**Purpose**: Get all users with filters
**Headers**: `Authorization: Bearer <token>`
**Query**: `role=student&status=active&page=1&limit=20&search=john`
**Response**:
```json
{
  "success": true,
  "users": [
    {
      "id": "user123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "subscriptionTier": "basic",
      "status": "active",
      "createdAt": "2024-01-15T10:00:00Z",
      "lastLogin": "2024-12-10T08:00:00Z"
    }
  ],
  "pagination": {/* ... */}
}
```

#### `/api/admin/users/:id/ban` - POST (Admin)
**Purpose**: Ban user
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "reason": "Violation of terms of service"
}
```
**Backend Tasks**:
- Update user status to "banned"
- Revoke access tokens
- Send ban notification email

#### `/api/admin/users/:id/unban` - POST (Admin)
**Purpose**: Unban user

#### `/api/admin/programs/:id/feature` - POST (Admin)
**Purpose**: Feature program on homepage

#### `/api/admin/analytics` - GET (Admin)
**Purpose**: Get detailed analytics
**Query**: `startDate=2024-01-01&endDate=2024-12-31&metric=revenue`
**Response**:
```json
{
  "success": true,
  "analytics": {
    "totalRevenue": 250000,
    "totalEnrollments": 12000,
    "conversionRate": 15.5,
    "topPrograms": [/* ... */],
    "topInstructors": [/* ... */],
    "userRetention": 78.5
  }
}
```

---

### 10. **ADDITIONAL ENDPOINTS**

#### `/api/categories` - GET
**Purpose**: Get all program categories
**Response**:
```json
{
  "success": true,
  "categories": [
    "Technology",
    "Development",
    "Marketing",
    "Financial",
    "Fitness Train",
    "Art & Design"
  ]
}
```

#### `/api/search` - GET
**Purpose**: Global search (programs, instructors)
**Query**: `q=react&type=programs&page=1`
**Response**:
```json
{
  "success": true,
  "results": {
    "programs": [/* ... */],
    "instructors": [/* ... */]
  }
}
```

#### `/api/notifications` - GET
**Purpose**: Get user notifications
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notif123...",
      "type": "enrollment",
      "title": "New student enrolled",
      "message": "John Doe enrolled in your React course",
      "read": false,
      "createdAt": "2024-12-10T09:00:00Z",
      "link": "/programs/prog123"
    }
  ],
  "unreadCount": 3
}
```

#### `/api/notifications/:id/read` - PUT
**Purpose**: Mark notification as read

---

## 🤖 AI INTEGRATION REQUIREMENTS

### AI Provider: OpenAI GPT-4 or Mistral AI

### Implementation Details:

#### 1. **AI Chat System Architecture**
```javascript
// Backend AI Service (backend/services/ai.service.js)
class AIService {
  async generateResponse(userMessage, context) {
    // Build system prompt with learning context
    const systemPrompt = `
      You are an expert learning assistant for LearninGPT platform.
      You help students learn ${context.programTitle}.
      Current topic: ${context.currentTopic}
      Student's level: ${context.userLevel}
      
      Your responses should:
      - Be clear and educational
      - Use analogies and examples
      - Break down complex concepts
      - Encourage learning
      - Provide code examples when relevant
    `;
    
    // Get conversation history
    const conversationHistory = await this.getConversationHistory(
      context.sessionId,
      5 // last 5 messages
    );
    
    // Build messages array for OpenAI
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });
    
    return response.choices[0].message.content;
  }
}
```

#### 2. **Context Building for AI**
- **User Context**: Enrolled programs, current learning path, quiz scores
- **Program Context**: Course content, curriculum, documentation
- **Session Context**: Previous conversation messages (last 5-10)
- **Personalization**: User's learning style, preferences, difficulty level

#### 3. **AI Features to Implement**

**a) Smart Q&A**
- Answer questions about course content
- Explain concepts in different ways
- Provide code examples
- Suggest learning resources

**b) Learning Path Recommendations**
```javascript
async generateLearningPath(userId) {
  // Analyze user's:
  // - Completed programs
  // - Quiz scores
  // - Learning goals
  // - Time spent
  
  // Generate personalized recommendations
  const prompt = `Based on this user profile, suggest next learning steps...`;
  const aiResponse = await openai.chat.completions.create({...});
  
  return parseLearningPath(aiResponse);
}
```

**c) Quiz Question Generation**
```javascript
async generateQuizQuestions(topic, difficulty, count) {
  const prompt = `
    Generate ${count} ${difficulty} level quiz questions about ${topic}.
    Format as JSON array with:
    - questionText
    - options (array of 4)
    - correctAnswer
    - explanation
  `;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

**d) Code Review & Feedback**
```javascript
async reviewCode(code, language, context) {
  const prompt = `
    Review this ${language} code for a student learning ${context.topic}:
    
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Provide:
    1. Correctness assessment
    2. Best practices suggestions
    3. Potential improvements
    4. Learning points
  `;
  
  return await this.generateResponse(prompt, context);
}
```

#### 4. **AI Rate Limiting & Cost Management**

```javascript
// Subscription-based AI limits
const AI_LIMITS = {
  free: {
    messagesPerDay: 10,
    tokensPerMessage: 500
  },
  basic: {
    messagesPerDay: 100,
    tokensPerMessage: 1000
  },
  premium: {
    messagesPerDay: -1, // unlimited
    tokensPerMessage: 2000,
    priorityQueue: true
  }
};

// Middleware to check AI usage limits
async function checkAILimit(req, res, next) {
  const user = req.user;
  const tier = user.subscriptionTier;
  
  const todayUsage = await getAIUsageToday(user.id);
  
  if (todayUsage >= AI_LIMITS[tier].messagesPerDay) {
    return res.status(429).json({
      error: "Daily AI message limit reached. Upgrade for more.",
      upgradeUrl: "/pricing"
    });
  }
  
  next();
}
```

#### 5. **AI Safety & Content Moderation**

```javascript
// Content moderation before sending to AI
async function moderateContent(message) {
  const moderationResponse = await openai.moderations.create({
    input: message
  });
  
  const flagged = moderationResponse.results[0].flagged;
  
  if (flagged) {
    throw new Error("Message contains inappropriate content");
  }
  
  return true;
}
```

#### 6. **AI Response Caching**
```javascript
// Cache common questions to reduce API costs
async function getCachedResponse(question, programId) {
  const cacheKey = `ai:${programId}:${hashQuestion(question)}`;
  
  // Check Redis cache
  const cached = await redis.get(cacheKey);
  if (cached) return cached;
  
  // Generate new response
  const response = await aiService.generateResponse(question);
  
  // Cache for 7 days
  await redis.setex(cacheKey, 7 * 24 * 60 * 60, response);
  
  return response;
}
```

---

## 💾 DATABASE SCHEMA DETAILS

*(Refer to the already created Mongoose models in `/backend/models/` folder)*

### Key Collections:

1. **users** - User accounts, authentication, stats
2. **programs** - Learning programs/courses
3. **quizzes** - Quiz definitions
4. **questions** - Quiz questions (separate for flexibility)
5. **quizAttempts** - User quiz attempts and scores
6. **certificates** - Generated certificates
7. **aiChats** - AI conversation sessions and messages
8. **instructors** - Instructor profiles and applications
9. **subscriptions** - Payment and subscription management
10. **reviews** - Program reviews and ratings
11. **enrollments** - User-program enrollments (can be embedded or separate)
12. **notifications** - User notifications

### Important Relationships:

```
User (1) → (Many) Programs (enrollments)
User (1) → (Many) QuizAttempts
User (1) → (Many) Certificates
User (1) → (Many) AIChatSessions
User (1) → (1) Subscription

Program (1) → (Many) Quizzes
Program (1) → (Many) Reviews
Program (1) → (1) Instructor

Quiz (1) → (Many) Questions
Quiz (1) → (Many) QuizAttempts

Instructor (1) → (Many) Programs
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION FLOW

### Authentication Strategy: JWT (JSON Web Tokens)

#### 1. **Registration Flow**
```
User submits registration form
  ↓
Backend validates input
  ↓
Hash password with bcrypt (salt rounds: 10)
  ↓
Create user in database (isVerified: false)
  ↓
Generate email verification token (JWT, 24h expiry)
  ↓
Send verification email
  ↓
User clicks email link
  ↓
Backend verifies token
  ↓
Update user.isVerified = true
  ↓
User can now login
```

#### 2. **Login Flow**
```
User submits email + password
  ↓
Backend finds user by email
  ↓
Check if email is verified
  ↓
Compare password with bcrypt
  ↓
Generate access token (JWT, 7 days)
  ↓
Generate refresh token (JWT, 30 days)
  ↓
Store refresh token in database/Redis
  ↓
Return both tokens + user data
  ↓
Frontend stores tokens in localStorage
```

#### 3. **JWT Payload Structure**
```javascript
// Access Token
{
  userId: "65abc123...",
  email: "john@example.com",
  role: "student", // or "instructor", "admin"
  subscriptionTier: "basic",
  iat: 1702200000,
  exp: 1702804800 // 7 days later
}

// Refresh Token
{
  userId: "65abc123...",
  tokenId: "unique_token_id",
  type: "refresh",
  iat: 1702200000,
  exp: 1704792000 // 30 days later
}
```

#### 4. **Middleware for Protected Routes**
```javascript
// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Check if user is banned
    if (user.status === 'banned') {
      return res.status(403).json({ error: 'Account is banned' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

#### 5. **Usage in Routes**
```javascript
// Example: Only instructors and admins can create programs
router.post('/programs', 
  authenticate, 
  authorize('instructor', 'admin'), 
  programController.create
);

// Example: Only the user themselves or admin can view profile
router.get('/users/:id/profile',
  authenticate,
  checkOwnershipOrAdmin,
  userController.getProfile
);
```

---

## 💳 PAYMENT INTEGRATION

### Provider: Stripe

#### 1. **Setup**
```javascript
// backend/config/stripe.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
```

#### 2. **Subscription Flow**
```javascript
// backend/controllers/subscription.controller.js

// Create subscription
async subscribe(req, res) {
  const { planId, paymentMethodId } = req.body;
  const user = req.user;
  
  try {
    // Get plan details
    const plan = SUBSCRIPTION_PLANS[planId];
    
    // Create or get Stripe customer
    let stripeCustomer = user.stripeCustomerId;
    
    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
      
      stripeCustomer = customer.id;
      user.stripeCustomerId = stripeCustomer;
      await user.save();
    }
    
    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomer,
      items: [{ price: plan.stripePriceId }],
      expand: ['latest_invoice.payment_intent']
    });
    
    // Save subscription to database
    const newSubscription = await Subscription.create({
      userId: user._id,
      planId: planId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      amount: plan.price
    });
    
    // Update user subscription tier
    user.subscriptionTier = planId;
    user.subscriptionExpiry = new Date(subscription.current_period_end * 1000);
    await user.save();
    
    res.json({
      success: true,
      subscription: newSubscription
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
}
```

#### 3. **One-Time Payment (Program Purchase)**
```javascript
async createPaymentIntent(req, res) {
  const { programId, accessType } = req.body;
  const user = req.user;
  
  // Get program and calculate amount
  const program = await Program.findById(programId);
  const amount = program.pricing[accessType];
  
  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    customer: user.stripeCustomerId,
    metadata: {
      userId: user._id.toString(),
      programId: programId,
      accessType: accessType
    }
  });
  
  res.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  });
}
```

#### 4. **Webhook Handler**
```javascript
// backend/routes/webhook.routes.js
const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');

router.post('/stripe', 
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle events
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;
        
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handleInvoicePayment(invoice);
        break;
        
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleSubscriptionCanceled(subscription);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  }
);

async function handlePaymentSuccess(paymentIntent) {
  const { userId, programId, accessType } = paymentIntent.metadata;
  
  // Create enrollment
  await Enrollment.create({
    userId,
    programId,
    accessType,
    paymentId: paymentIntent.id,
    amount: paymentIntent.amount / 100
  });
  
  // Send confirmation email
  await sendEnrollmentEmail(userId, programId);
}

module.exports = router;
```

---

## 📁 FILE UPLOAD & STORAGE

### Provider: Cloudinary

#### 1. **Setup**
```javascript
// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
```

#### 2. **Upload Middleware**
```javascript
// backend/middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});

module.exports = upload;
```

#### 3. **Upload Service**
```javascript
// backend/services/upload.service.js
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

class UploadService {
  async uploadImage(fileBuffer, folder = 'general') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `learninggpt/${folder}`,
          resource_type: 'auto',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error,