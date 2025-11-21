# Database Schema Visualization

## Entity Relationship Diagram

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                          LearninGPT DATABASE SCHEMA                           ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│                                   USERS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                          │
│ name: String                                                                │
│ email: String (unique)                                                      │
│ password: String (hashed)                                                   │
│ role: enum(user, admin, instructor)                                        │
│ avatar: String                                                              │
│ googleId: String                                                            │
│                                                                             │
│ stats: {                                                                    │
│   quizzesCompleted: Number                                                  │
│   totalScore: Number                                                        │
│   averageScore: Number                                                      │
│   aiInteractions: Number                                                    │
│   studyHours: Number                                                        │
│ }                                                                           │
│                                                                             │
│ goals: {                                                                    │
│   weeklyStudyGoal: Number                                                   │
│   monthlyQuizGoal: Number                                                   │
│ }                                                                           │
│                                                                             │
│ enrolledPrograms: [{                                                        │
│   program: ObjectId -> PROGRAMS                                             │
│   enrolledAt: Date                                                          │
│   progress: Number (0-100)                                                  │
│   status: enum(not-started, in-progress, completed)                        │
│ }]                                                                          │
│                                                                             │
│ subscription: {                                                             │
│   plan: enum(free, exam-only, ai-only, full-access)                       │
│   startDate: Date                                                           │
│   endDate: Date                                                             │
│   isActive: Boolean                                                         │
│   stripeCustomerId: String                                                  │
│   stripeSubscriptionId: String                                              │
│ }                                                                           │
│                                                                             │
│ preferences: { language, notifications, theme }                            │
│ createdAt: Date                                                             │
│ updatedAt: Date                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                QUIZ_ATTEMPTS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                          │
│ user: ObjectId -> USERS (FK)                                                │
│ quiz: ObjectId -> QUIZZES (FK)                                              │
│ program: ObjectId -> PROGRAMS (FK)                                          │
│                                                                             │
│ answers: [{                                                                 │
│   question: ObjectId -> QUESTIONS                                           │
│   selectedOptions: [Number]                                                 │
│   textAnswer: String                                                        │
│   isCorrect: Boolean                                                        │
│   marksObtained: Number                                                     │
│   timeTaken: Number                                                         │
│ }]                                                                          │
│                                                                             │
│ score: {                                                                    │
│   obtained: Number                                                          │
│   total: Number                                                             │
│   percentage: Number (auto-calculated)                                      │
│ }                                                                           │
│                                                                             │
│ duration: { allocated: Number, taken: Number }                             │
│ status: enum(in-progress, completed, abandoned, expired)                   │
│ isPassed: Boolean                                                           │
│ attemptNumber: Number                                                       │
│                                                                             │
│ metrics: {                                                                  │
│   correctAnswers: Number                                                    │
│   incorrectAnswers: Number                                                  │
│   skippedQuestions: Number                                                  │
│   averageTimePerQuestion: Number                                            │
│ }                                                                           │
│                                                                             │
│ aiHelpUsed: Boolean                                                         │
│ aiInteractions: [{ question, helpText, timestamp }]                        │
│ startedAt: Date                                                             │
│ completedAt: Date                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:1 (if passed)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               CERTIFICATES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                          │
│ user: ObjectId -> USERS (FK)                                                │
│ program: ObjectId -> PROGRAMS (FK)                                          │
│                                                                             │
│ certificateNumber: String (unique, auto: LGPT-2025-000001)                 │
│ title: String                                                               │
│ issuedAt: Date                                                              │
│ validUntil: Date (null = lifetime)                                         │
│                                                                             │
│ performance: {                                                              │
│   finalScore: Number                                                        │
│   totalQuizzes: Number                                                      │
│   completedQuizzes: Number                                                  │
│   averageScore: Number                                                      │
│ }                                                                           │
│                                                                             │
│ certificateUrl: String (PDF link)                                          │
│ verificationCode: String (unique)                                          │
│ status: enum(active, revoked, expired)                                     │
│                                                                             │
│ metadata: {                                                                 │
│   completionDate: Date                                                      │
│   totalHoursStudied: Number                                                 │
│   skillLevel: enum(Beginner, Intermediate, Advanced)                       │
│ }                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                 PROGRAMS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                          │
│ name: String (unique)                                                       │
│ topic: String                                                               │
│ description: String                                                         │
│ category: enum(Development, Business, Marketing, ...)                      │
│ difficulty: enum(Beginner, Intermediate, Advanced)                         │
│                                                                             │
│ thumbnail: String                                                           │
│ coverImage: String                                                          │
│ overview: String                                                            │
│ learningObjectives: [String]                                               │
│ prerequisites: [String]                                                     │
│                                                                             │
│ quizzes: [ObjectId] -> QUIZZES                                              │
│                                                                             │
│ documentation: [{                                                           │
│   title: String                                                             │
│   content: String                                                           │
│   fileUrl: String                                                           │
│   type: enum(pdf, doc, video, link, text)                                  │
│ }]                                                                          │
│                                                                             │
│ stats: {                                                                    │
│   enrolledUsers: Number                                                     │
│   completedUsers: Number                                                    │
│   averageRating: Number (0-5)                                               │
│   totalReviews: Number                                                      │
│ }                                                                           │
│                                                                             │
│ certificateEnabled: Boolean                                                 │
│ passingCriteria: { minimumScore, requiredQuizzes }                         │
│                                                                             │
│ instructor: ObjectId -> INSTRUCTORS (FK)                                    │
│ pricing: { isFree, price, currency }                                       │
│ status: enum(draft, published, archived)                                   │
│ isFeatured: Boolean                                                         │
│ estimatedDuration: Number (hours)                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  QUIZZES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                          │
│ title: String                                                               │
│ description: String                                                         │
│ program: ObjectId -> PROGRAMS (FK)                                          │
│                                                                             │
│ type: enum(exam-simulator, guided-questions, practice)                     │
│                                                                             │
│ settings: {                                                                 │
│   duration: Number (minutes)                                                │
│   totalMarks: Number                                                        │
│   passingMarks: Number                                                      │
│   shuffleQuestions: Boolean                                                 │
│   shuffleOptions: Boolean                                                   │
│   showResults: Boolean                                                      │
│   allowRetake: Boolean                                                      │
│   maxAttempts: Number                                                       │
│   showExplanations: Boolean                                                 │
│ }                                                                           │
│                                                                             │
│ questions: [ObjectId] -> QUESTIONS                                          │
│ questionsCount: Number (auto-calculated)                                   │
│                                                                             │
│ stats: {                                                                    │
│   attempts: Number                                                          │
│   avgScore: Number                                                          │
│   highestScore: Number                                                      │
│   lowestScore: Number                                                       │
│   completionRate: Number                                                    │
│ }                                                                           │
│                                                                             │
│ difficulty: enum(easy, medium, hard)                                       │
│ status: enum(draft, active, archived)                                      │
│ createdBy: ObjectId -> USERS (admin/instructor)                            │
│ tags: [String]                                                              │
│ aiEnabled: Boolean                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                QUESTIONS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                          │
│ question: String                                                            │
│ type: enum(single, multiple, true-false, short-answer)                     │
│                                                                             │
│ options: [{                                                                 │
│   text: String                                                              │
│   isCorrect: Boolean                                                        │
│ }]                                                                          │
│                                                                             │
│ correctAnswer: String (for short-answer)                                   │
│ explanation: String                                                         │
│ marks: Number (default: 1)                                                  │
│ difficulty: enum(easy, medium, hard)                                       │
│                                                                             │
│ quiz: ObjectId -> QUIZZES (FK)                                              │
│                                                                             │
│ media: {                                                                    │
│   type: enum(image, video, audio, none)                                    │
│   url: String                                                               │
│ }                                                                           │
│                                                                             │
│ tags: [String]                                                              │
│ topic: String                                                               │
│                                                                             │
│ stats: {                                                                    │
│   timesAnswered: Number                                                     │
│   timesCorrect: Number                                                      │
│   difficultyRating: Number (0-5)                                            │
│ }                                                                           │
│                                                                             │
│ createdBy: ObjectId -> USERS                                                │
│ isActive: Boolean                                                           │
│ order: Number                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                AI_CHATS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                          │
│ user: ObjectId -> USERS (FK)                                                │
│ sessionId: String (unique)                                                  │
│ title: String                                                               │
│                                                                             │
│ context: {                                                                  │
│   type: enum(general, program, quiz, question)                             │
│   program: ObjectId -> PROGRAMS                                             │
│   quiz: ObjectId -> QUIZZES                                                 │
│   question: ObjectId -> QUESTIONS                                           │
│ }                                                                           │
│                                                                             │
│ messages: [{                                                                │
│   role: enum(user, assistant, system)                                      │
│   content: String                                                           │
│   timestamp: Date                                                           │
│   metadata: { model, tokens, confidence }                                   │
│ }]                                                                          │
│                                                                             │
│ stats: {                                                                    │
│   messageCount: Number                                                      │
│   userMessages: Number                                                      │
│   aiMessages: Number                                                        │
│   totalTokens: Number                                                       │
│ }                                                                           │
│                                                                             │
│ status: enum(active, archived, deleted)                                    │
│ lastActivityAt: Date                                                        │
│ tags: [String]                                                              │
│                                                                             │
│ feedback: {                                                                 │
│   rating: Number (1-5)                                                      │
│   comment: String                                                           │
│   helpful: Boolean                                                          │
│ }                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              INSTRUCTORS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                          │
│ name: String                                                                │
│ email: String (unique)                                                      │
│ user: ObjectId -> USERS (optional)                                          │
│                                                                             │
│ areaOfExpertise: String                                                     │
│ bio: String                                                                 │
│                                                                             │
│ portfolio: {                                                                │
│   fileUrl: String                                                           │
│   fileName: String                                                          │
│   uploadedAt: Date                                                          │
│ }                                                                           │
│                                                                             │
│ experience: Number (years)                                                  │
│ education: [{ degree, institution, year }]                                 │
│ certifications: [{ name, issuedBy, issuedDate, certificateUrl }]          │
│                                                                             │
│ socialLinks: { linkedin, twitter, website, github }                        │
│ avatar: String                                                              │
│                                                                             │
│ programs: [ObjectId] -> PROGRAMS                                            │
│                                                                             │
│ stats: {                                                                    │
│   totalStudents: Number                                                     │
│   totalPrograms: Number                                                     │
│   averageRating: Number (0-5)                                               │
│   totalReviews: Number                                                      │
│ }                                                                           │
│                                                                             │
│ status: enum(pending, approved, rejected, suspended)                       │
│ adminNotes: String                                                          │
│ approvedBy: ObjectId -> USERS (admin)                                       │
│ approvedAt: Date                                                            │
│ isActive: Boolean                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                             SUBSCRIPTIONS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                          │
│ user: ObjectId -> USERS (FK) [1:1]                                          │
│                                                                             │
│ plan: {                                                                     │
│   type: enum(exam-only, ai-only, full-access)                             │
│   name: String                                                              │
│   price: Number (19.99 or 29.99 CAD)                                       │
│   currency: String (default: CAD)                                          │
│   billingCycle: enum(monthly, yearly)                                      │
│ }                                                                           │
│                                                                             │
│ features: [String]                                                          │
│ startDate: Date                                                             │
│ endDate: Date                                                               │
│ status: enum(active, cancelled, expired, paused)                           │
│                                                                             │
│ payment: {                                                                  │
│   stripeCustomerId: String                                                  │
│   stripeSubscriptionId: String                                              │
│   stripePriceId: String                                                     │
│   lastPaymentDate: Date                                                     │
│   nextPaymentDate: Date                                                     │
│   paymentMethod: enum(stripe, paypal, card)                                │
│ }                                                                           │
│                                                                             │
│ autoRenew: Boolean                                                          │
│                                                                             │
│ trial: {                                                                    │
│   isTrial: Boolean                                                          │
│   trialEndsAt: Date                                                         │
│ }                                                                           │
│                                                                             │
│ limits: {                                                                   │
│   aiChatsPerMonth: Number (-1 = unlimited)                                 │
│   quizzesPerMonth: Number (-1 = unlimited)                                 │
│   currentAiChats: Number                                                    │
│   currentQuizzes: Number                                                    │
│   resetDate: Date                                                           │
│ }                                                                           │
│                                                                             │
│ discount: { code, percentage, amount, appliedAt }                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                 REVIEWS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                                          │
│ user: ObjectId -> USERS (FK)                                                │
│                                                                             │
│ target: {                                                                   │
│   type: enum(program, quiz, platform)                                      │
│   program: ObjectId -> PROGRAMS                                             │
│   quiz: ObjectId -> QUIZZES                                                 │
│ }                                                                           │
│                                                                             │
│ rating: Number (1-5 stars, required)                                       │
│ comment: String (max 1000 chars)                                           │
│                                                                             │
│ tags: [String] enum(                                                        │
│   'Loved the question format',                                             │
│   'Challenging but helpful',                                               │
│   'AI help was useful',                                                    │
│   'Great content', ...                                                     │
│ )                                                                           │
│                                                                             │
│ quizAttempt: ObjectId -> QUIZ_ATTEMPTS (optional)                           │
│                                                                             │
│ status: enum(pending, approved, rejected, flagged)                         │
│                                                                             │
│ moderation: {                                                               │
│   moderatedBy: ObjectId -> USERS                                            │
│   moderatedAt: Date                                                         │
│   reason: String                                                            │
│ }                                                                           │
│                                                                             │
│ votes: {                                                                    │
│   helpful: Number                                                           │
│   notHelpful: Number                                                        │
│   votedBy: [{ user, vote }]                                                │
│ }                                                                           │
│                                                                             │
│ response: {                                                                 │
│   text: String                                                              │
│   respondedBy: ObjectId -> USERS (admin)                                    │
│   respondedAt: Date                                                         │
│ }                                                                           │
│                                                                             │
│ isFeatured: Boolean                                                         │
│ createdAt: Date                                                             │
│ updatedAt: Date                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════════════════════╗
║                         RELATIONSHIP SUMMARY                                  ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ USER ──1:N──→ QUIZ_ATTEMPT                                                   ║
║ USER ──1:N──→ CERTIFICATE                                                    ║
║ USER ──1:N──→ AI_CHAT                                                        ║
║ USER ──1:N──→ REVIEW                                                         ║
║ USER ──1:1──→ SUBSCRIPTION                                                   ║
║ USER ──M:N──→ PROGRAM (via enrolledPrograms)                                 ║
║                                                                               ║
║ PROGRAM ──1:N──→ QUIZ                                                        ║
║ PROGRAM ──N:1──→ INSTRUCTOR                                                  ║
║ PROGRAM ──1:N──→ REVIEW                                                      ║
║                                                                               ║
║ QUIZ ──1:N──→ QUESTION                                                       ║
║ QUIZ ──1:N──→ QUIZ_ATTEMPT                                                   ║
║ QUIZ ──N:1──→ PROGRAM                                                        ║
║                                                                               ║
║ QUIZ_ATTEMPT ──N:1──→ USER                                                   ║
║ QUIZ_ATTEMPT ──N:1──→ QUIZ                                                   ║
║ QUIZ_ATTEMPT ──1:1──→ CERTIFICATE (if passed)                                ║
║                                                                               ║
║ CERTIFICATE ──N:1──→ USER                                                    ║
║ CERTIFICATE ──N:1──→ PROGRAM                                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

## Collection Counts & Data Estimates

- **Users**: ~10,000+ users
- **Programs**: ~50-100 programs
- **Quizzes**: ~500-1000 quizzes (5-10 per program)
- **Questions**: ~10,000-50,000 questions (20-100 per quiz)
- **Quiz Attempts**: ~100,000+ attempts
- **Certificates**: ~5,000+ certificates
- **AI Chats**: ~50,000+ chat sessions
- **Instructors**: ~50-200 instructors
- **Subscriptions**: ~3,000+ active subscriptions
- **Reviews**: ~10,000+ reviews
