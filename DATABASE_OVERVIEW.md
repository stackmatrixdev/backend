# LearninGPT - Database Schema Overview

## Database Architecture Summary

This document provides a comprehensive overview of the MongoDB database structure for the LearninGPT platform.

---

## 📊 Database Models (10 Collections)

### 1. **Users Collection**
**Purpose**: Store user accounts, authentication, and profile data

**Key Features**:
- Authentication (email/password + Google OAuth)
- User roles: user, admin, instructor
- Progress tracking and statistics
- Subscription management
- Learning goals and preferences

**Relations**:
- One-to-Many: QuizAttempts, Certificates, AIChats, Reviews
- Many-to-Many: Programs (via enrolledPrograms)
- One-to-One: Subscription

---

### 2. **Programs Collection**
**Purpose**: Learning programs/courses offered on the platform

**Key Features**:
- 10 categories (Development, Business, Marketing, etc.)
- Difficulty levels (Beginner, Intermediate, Advanced)
- Associated quizzes and documentation
- Enrollment and completion tracking
- Certificate generation settings
- Free and paid programs

**Relations**:
- One-to-Many: Quizzes
- Many-to-One: Instructor
- Many-to-Many: Users (enrollments)

---

### 3. **Quizzes Collection**
**Purpose**: Quiz and exam simulator definitions

**Key Features**:
- Three types: exam-simulator, guided-questions, practice
- Configurable settings (duration, passing marks, retake policy)
- Question shuffling options
- Attempt tracking and statistics
- Status: draft, active, archived

**Relations**:
- Many-to-One: Program
- One-to-Many: Questions, QuizAttempts

---

### 4. **Questions Collection**
**Purpose**: Individual quiz questions

**Key Features**:
- Question types: single choice, multiple choice, true/false, short answer
- Multiple options with correct answer marking
- Detailed explanations
- Media attachments (images, videos)
- Difficulty levels and statistics

**Relations**:
- Many-to-One: Quiz
- Referenced by: QuizAttempts

---

### 5. **QuizAttempts Collection**
**Purpose**: Track user quiz attempts and results

**Key Features**:
- Complete answer tracking
- Scoring and percentage calculation
- Time tracking (allocated vs. taken)
- Pass/fail determination
- AI help usage tracking
- Detailed performance metrics

**Relations**:
- Many-to-One: User, Quiz, Program
- One-to-One: Certificate (if passed)

---

### 6. **Certificates Collection**
**Purpose**: Digital certificates for course completion

**Key Features**:
- Auto-generated certificate numbers (LGPT-2025-000001)
- Unique verification codes
- Performance data snapshot
- PDF generation support
- Validity tracking
- Revocation capability

**Relations**:
- Many-to-One: User, Program
- One-to-One: QuizAttempt (optional)

---

### 7. **AIChats Collection**
**Purpose**: AI chatbot conversation history

**Key Features**:
- Session-based conversations
- Context-aware (general, program, quiz, question)
- Message history with metadata
- Token usage tracking
- User feedback and ratings
- Conversation management (archive, delete)

**Relations**:
- Many-to-One: User
- Optional references: Program, Quiz, Question

---

### 8. **Instructors Collection**
**Purpose**: Instructor profiles and application management

**Key Features**:
- Professional credentials
- Portfolio uploads
- Education and certifications
- Social media links
- Approval workflow (pending → approved/rejected)
- Instructor statistics and ratings

**Relations**:
- One-to-One: User (optional)
- One-to-Many: Programs

---

### 9. **Subscriptions Collection**
**Purpose**: User subscriptions and payment tracking

**Key Features**:
- Three plans: Exam Only, AI Only, Full Access
- Stripe integration
- Monthly/Yearly billing cycles
- Usage limits and tracking
- Auto-renewal management
- Trial period support

**Relations**:
- One-to-One: User

**Pricing**:
- Exam Simulator Only: $19.99 CAD/month
- AI Coach Only: $19.99 CAD/month
- Full Access: $29.99 CAD/month

---

### 10. **Reviews Collection**
**Purpose**: User reviews and feedback

**Key Features**:
- Target programs, quizzes, or platform
- 1-5 star ratings
- Quick feedback tags
- Helpful voting system
- Moderation workflow
- Featured reviews

**Relations**:
- Many-to-One: User
- Optional: Program, Quiz, QuizAttempt

---

## 🔗 Key Relationships

```
┌─────────────┐
│    USER     │
└──────┬──────┘
       │
       ├─── enrolledPrograms ──→ PROGRAM
       │
       ├─── subscription ──→ SUBSCRIPTION (1:1)
       │
       ├─── attempts ──→ QUIZ_ATTEMPT (1:N)
       │
       ├─── certificates ──→ CERTIFICATE (1:N)
       │
       ├─── chats ──→ AI_CHAT (1:N)
       │
       └─── reviews ──→ REVIEW (1:N)

┌─────────────┐
│   PROGRAM   │
└──────┬──────┘
       │
       ├─── quizzes ──→ QUIZ (1:N)
       │
       ├─── instructor ──→ INSTRUCTOR (N:1)
       │
       └─── reviews ──→ REVIEW (1:N)

┌─────────────┐
│    QUIZ     │
└──────┬──────┘
       │
       ├─── questions ──→ QUESTION (1:N)
       │
       ├─── attempts ──→ QUIZ_ATTEMPT (1:N)
       │
       └─── program ──→ PROGRAM (N:1)

┌─────────────┐
│QUIZ_ATTEMPT │
└──────┬──────┘
       │
       ├─── user ──→ USER (N:1)
       │
       ├─── quiz ──→ QUIZ (N:1)
       │
       └─── certificate ──→ CERTIFICATE (1:1 if passed)
```

---

## 📈 Data Flow Examples

### User Registration & Enrollment Flow
```
1. User registers → USER document created
2. User browses programs → PROGRAM documents queried
3. User enrolls → USER.enrolledPrograms updated
4. User starts quiz → QUIZ_ATTEMPT created (status: in-progress)
5. User submits quiz → QUIZ_ATTEMPT updated (status: completed)
6. If passed → CERTIFICATE generated
```

### AI Chat Flow
```
1. User opens AI coach → AI_CHAT session created
2. User sends message → AI_CHAT.messages.push({ role: 'user', ... })
3. AI responds → AI_CHAT.messages.push({ role: 'assistant', ... })
4. Stats updated → messageCount, totalTokens
5. User rates chat → AI_CHAT.feedback updated
```

### Subscription Flow
```
1. User chooses plan → SUBSCRIPTION created
2. Stripe checkout → payment.stripeCustomerId saved
3. Payment success → status: 'active', dates set
4. Monthly reset → limits.currentAiChats/Quizzes reset
5. Cancellation → status: 'cancelled', cancelledAt timestamp
```

---

## 🔒 Security Features

### User Model
- Password hashing with bcrypt (10 salt rounds)
- Password not returned in queries by default
- Email verification tokens
- Password reset tokens with expiration

### Authentication
- JWT tokens for session management
- Refresh tokens for extended sessions
- Role-based access control (RBAC)

### Data Protection
- Input validation on all models
- Unique constraints on emails, certificate numbers
- Indexed fields for query performance
- Soft deletes (isActive flags)

---

## 📊 Statistics & Analytics

### User Stats
- Quizzes completed
- Average score
- Total score
- AI interactions count
- Study hours

### Program Stats
- Enrolled users count
- Completed users count
- Average rating
- Total reviews

### Quiz Stats
- Total attempts
- Average score
- Highest/lowest scores
- Completion rate

### Instructor Stats
- Total students taught
- Total programs created
- Average rating
- Total reviews

---

## 🎯 Business Logic Hooks

### Pre-Save Hooks
- **User**: Hash password before saving
- **Quiz**: Update questionsCount when questions change
- **Question**: Validate at least one correct answer
- **QuizAttempt**: Calculate percentage score
- **Certificate**: Generate certificate number and verification code

### Post-Save Hooks
- **Review**: Update program/quiz average rating

### Methods
- **User.comparePassword()**: Verify login password
- **User.updateAverageScore()**: Recalculate average
- **Subscription.isActive()**: Check subscription validity
- **AIChat.addMessage()**: Add message and update stats

---

## 📝 Indexes for Performance

```javascript
// User
{ email: 1 } // unique
{ 'subscription.stripeCustomerId': 1 }

// Program
{ name: 'text', topic: 'text', description: 'text' } // search
{ category: 1, status: 1 }

// Quiz
{ program: 1, status: 1 }

// QuizAttempt
{ user: 1, quiz: 1, createdAt: -1 }

// Certificate
{ verificationCode: 1 } // unique
{ user: 1, program: 1 }

// AIChat
{ user: 1, createdAt: -1 }
{ sessionId: 1 } // unique

// Review
{ user: 1, 'target.type': 1, 'target.program': 1 } // unique composite
```

---

## 🚀 Future Enhancements

1. **Achievements System**: Gamification with badges
2. **Learning Paths**: Structured course sequences
3. **Social Features**: User connections, study groups
4. **Analytics Dashboard**: Detailed learning analytics
5. **Mobile App Support**: Push notifications, offline mode
6. **Multi-language Support**: i18n for global reach
7. **Video Content**: Video lessons and tutorials
8. **Live Sessions**: Real-time instructor-led classes

---

## 📦 Installation & Setup

See `backend/README.md` for detailed setup instructions.

**Quick Start**:
```bash
cd backend
npm install
cp .env.example .env
# Configure .env
npm run dev
```

---

**Database designed for scalability, performance, and maintainability** ✨
