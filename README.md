# LearninGPT Backend - Database Structure

## Overview
This is the backend API for **LearninGPT**, an AI-powered learning platform that provides interactive quizzes, exam simulators, AI coaching, and certification programs.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **Payment**: Stripe

## Project Structure
```
backend/
├── models/              # Mongoose schemas/models
│   ├── User.model.js
│   ├── Program.model.js
│   ├── Quiz.model.js
│   ├── Question.model.js
│   ├── QuizAttempt.model.js
│   ├── Certificate.model.js
│   ├── AIChat.model.js
│   ├── Instructor.model.js
│   ├── Subscription.model.js
│   └── Review.model.js
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── quiz.routes.js
│   ├── program.routes.js
│   ├── question.routes.js
│   ├── attempt.routes.js
│   ├── certificate.routes.js
│   ├── aiChat.routes.js
│   ├── instructor.routes.js
│   ├── subscription.routes.js
│   └── review.routes.js
├── controllers/         # Route handlers (to be implemented)
├── middleware/          # Custom middleware (auth, validation, etc.)
├── utils/              # Utility functions
├── config/             # Configuration files
├── server.js           # Entry point
├── package.json
└── .env.example        # Environment variables template
```

## Database Models

### 1. User Model
Manages user accounts, authentication, and user statistics.

**Key Fields:**
- `name`, `email`, `password`, `role` (user/admin/instructor)
- `stats`: quizzesCompleted, averageScore, aiInteractions, studyHours
- `goals`: weeklyStudyGoal, monthlyQuizGoal
- `enrolledPrograms`: Array of enrolled programs with progress
- `subscription`: Plan details, payment info
- `preferences`: Language, notifications, theme

**Features:**
- Password hashing with bcrypt
- Email verification
- Password reset functionality
- Progress tracking
- Subscription management

### 2. Program Model
Represents learning programs/courses.

**Key Fields:**
- `name`, `topic`, `description`, `category`
- `difficulty`: Beginner/Intermediate/Advanced
- `quizzes`: Associated quizzes
- `documentation`: Learning resources
- `stats`: enrolledUsers, completedUsers, averageRating
- `certificateEnabled`: Whether program offers certificates
- `instructor`: Reference to instructor
- `pricing`: Free or paid program

**Categories:**
- Development, Business, Marketing, Lifestyle, Music, Design, Academics, Health & Fitness, Productivity, Accounting

### 3. Quiz Model
Represents quizzes and exam simulators.

**Key Fields:**
- `title`, `description`, `program` reference
- `type`: exam-simulator, guided-questions, practice
- `settings`: duration, totalMarks, passingMarks, shuffleQuestions, allowRetake, maxAttempts
- `questions`: Array of question references
- `stats`: attempts, avgScore, completionRate
- `difficulty`: easy/medium/hard
- `status`: draft/active/archived

### 4. Question Model
Individual quiz questions.

**Key Fields:**
- `question`: Question text
- `type`: single/multiple/true-false/short-answer
- `options`: Array with text and isCorrect flag
- `explanation`: Detailed explanation
- `marks`: Points for the question
- `difficulty`: easy/medium/hard
- `media`: Optional image/video/audio
- `stats`: timesAnswered, timesCorrect

### 5. QuizAttempt Model
Tracks user quiz attempts and results.

**Key Fields:**
- `user`, `quiz`, `program` references
- `answers`: Array of user answers with correctness
- `score`: obtained, total, percentage
- `duration`: allocated and taken time
- `status`: in-progress/completed/abandoned/expired
- `isPassed`: Boolean
- `metrics`: correctAnswers, incorrectAnswers, averageTimePerQuestion
- `aiHelpUsed`: Whether AI assistance was used

### 6. Certificate Model
Digital certificates for course completion.

**Key Fields:**
- `user`, `program` references
- `certificateNumber`: Unique identifier (auto-generated)
- `performance`: finalScore, totalQuizzes, averageScore
- `certificateUrl`: Link to certificate file
- `verificationCode`: For certificate verification
- `status`: active/revoked/expired
- `issuedAt`: Timestamp

**Format:** `LGPT-2025-000001`

### 7. AIChat Model
AI chatbot conversation history.

**Key Fields:**
- `user` reference
- `sessionId`: Unique session identifier
- `title`: Conversation title
- `context`: What the chat relates to (program/quiz/question)
- `messages`: Array of user/assistant messages
- `stats`: messageCount, totalTokens
- `feedback`: User rating and comments

### 8. Instructor Model
Instructor profiles and applications.

**Key Fields:**
- `name`, `email`, `areaOfExpertise`, `bio`
- `portfolio`: File upload
- `experience`: Years of experience
- `education`, `certifications`: Arrays
- `socialLinks`: LinkedIn, Twitter, etc.
- `programs`: Created programs
- `stats`: totalStudents, averageRating
- `status`: pending/approved/rejected/suspended

### 9. Subscription Model
User subscription and payment tracking.

**Key Fields:**
- `user` reference
- `plan`: exam-only/ai-only/full-access
- `price`, `billingCycle`: monthly/yearly
- `startDate`, `endDate`
- `status`: active/cancelled/expired/paused
- `payment`: Stripe integration fields
- `autoRenew`: Boolean
- `limits`: Usage limits for AI chats and quizzes

**Plans:**
- Exam Simulator Only: 19.99 CAD/month
- AI Coach Only: 19.99 CAD/month
- Full Access: 29.99 CAD/month

### 10. Review Model
User reviews and feedback.

**Key Fields:**
- `user` reference
- `target`: program/quiz/platform
- `rating`: 1-5 stars
- `comment`: Review text
- `tags`: Quick feedback tags
- `votes`: helpful/notHelpful counts
- `status`: pending/approved/rejected
- `isFeatured`: Highlighted reviews

## Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

5. **Run the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Environment Variables

See `.env.example` for required environment variables:
- Database connection
- JWT secrets
- Email configuration
- Cloudinary credentials
- AI API keys
- Payment gateway keys

## API Endpoints (To Be Implemented)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/stats` - Get user statistics
- `POST /api/users/enroll/:programId` - Enroll in program

### Programs
- `GET /api/programs` - Get all programs
- `GET /api/programs/:id` - Get program details
- `POST /api/programs` - Create program (admin/instructor)
- `GET /api/programs/:id/quizzes` - Get program quizzes

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes` - Create quiz (admin/instructor)
- `POST /api/quizzes/:id/start` - Start quiz attempt

### Quiz Attempts
- `POST /api/attempts/start` - Start quiz attempt
- `POST /api/attempts/:id/submit` - Submit quiz
- `GET /api/attempts/:id/results` - Get results

### Certificates
- `GET /api/certificates/user/:userId` - Get user certificates
- `POST /api/certificates/generate` - Generate certificate
- `GET /api/certificates/verify/:code` - Verify certificate

### AI Chat
- `POST /api/ai-chat/session` - Create chat session
- `POST /api/ai-chat/message` - Send message
- `GET /api/ai-chat/sessions` - Get user sessions

### Subscriptions
- `POST /api/subscriptions/create` - Create subscription
- `GET /api/subscriptions/user/:userId` - Get user subscription
- `PUT /api/subscriptions/:id/cancel` - Cancel subscription

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/program/:programId` - Get program reviews
- `POST /api/reviews/:id/vote` - Vote on review

## Database Relationships

```
User ──────→ Subscription (1:1)
  │
  ├──────→ QuizAttempt (1:N)
  │
  ├──────→ Certificate (1:N)
  │
  ├──────→ AIChat (1:N)
  │
  ├──────→ Review (1:N)
  │
  └──────→ enrolledPrograms (M:N with Program)

Program ────→ Quiz (1:N)
  │
  ├──────→ Instructor (N:1)
  │
  └──────→ Review (1:N)

Quiz ───────→ Question (1:N)
  │
  ├──────→ QuizAttempt (1:N)
  │
  └──────→ Review (1:N)

QuizAttempt ─→ Certificate (1:1 if passed)
```

## Next Steps

1. **Implement Controllers**: Create controller files with business logic
2. **Add Middleware**: Authentication, authorization, validation
3. **Error Handling**: Custom error classes and handlers
4. **File Upload**: Implement Cloudinary integration
5. **Email Service**: Setup email templates and sending
6. **AI Integration**: Connect to OpenAI/Mistral API
7. **Payment Gateway**: Implement Stripe integration
8. **Testing**: Write unit and integration tests
9. **Documentation**: API documentation with Swagger

## Development Guidelines

- Use ES6 modules (import/export)
- Follow RESTful API conventions
- Implement proper error handling
- Validate input data
- Use async/await for asynchronous operations
- Add proper logging
- Implement rate limiting
- Add API documentation

## License
ISC

---

**Built for LearninGPT** - AI-Powered Learning Platform
# backend
