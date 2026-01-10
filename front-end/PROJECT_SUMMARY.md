# LearninGPT - Full Stack Project Summary

## 🎯 Project Overview

**LearninGPT** is a comprehensive AI-powered learning platform that helps users prepare for exams through interactive quiz simulators, guided questions, and smart AI assistance. The platform features user management, progress tracking, certificate generation, and subscription-based access to premium features.

---

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit + Redux Persist
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **UI Components**: Lucide Icons, React Icons
- **Charts**: Chart.js, Recharts
- **Forms**: React Quill (rich text editor)
- **Notifications**: React Hot Toast, SweetAlert2

### Backend (New)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, CORS, cookie-parser
- **File Upload**: Multer + Cloudinary
- **Payments**: Stripe integration

---

## 📁 Project Structure

```
roumsy-landing-page/
│
├── frontend/                     # React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Admin/          # Admin dashboard
│   │   │   ├── Hero/           # Landing page hero
│   │   │   ├── Navbar/         # Navigation
│   │   │   ├── Footer/         # Footer
│   │   │   └── ... (30+ components)
│   │   │
│   │   ├── Pages/              # Page components
│   │   │   ├── Auth/          # Login, Signup, Password Reset
│   │   │   ├── Dashboard/     # User dashboard
│   │   │   ├── Home/          # Profile, Certificates
│   │   │   ├── QuizInterface/ # Quiz taking interface
│   │   │   └── Topics/        # Program listing
│   │   │
│   │   ├── Routers/           # Route configuration
│   │   ├── Stores/            # Redux store
│   │   ├── Api/               # API utilities
│   │   └── assets/            # Images, icons
│   │
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── backend/                     # NEW! Node.js API (Created)
    ├── models/                  # Mongoose schemas (10 models)
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
    │
    ├── routes/                  # API endpoints
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
    │
    ├── config/                  # Configuration
    │   └── database.js
    │
    ├── server.js               # Entry point
    ├── package.json
    ├── .env.example
    ├── README.md
    ├── DATABASE_OVERVIEW.md    # Comprehensive schema docs
    ├── DATABASE_DIAGRAM.md     # Visual ER diagram
    └── QUICKSTART.md           # Setup guide
```

---

## 🗄️ Database Schema (10 Collections)

### Core Collections

#### 1. **Users**
- Authentication & authorization (user/admin/instructor roles)
- Profile management (name, email, avatar)
- Learning statistics (quizzes completed, average score, AI interactions)
- Enrolled programs with progress tracking
- Subscription details (plan, payment info)
- Learning goals & preferences

#### 2. **Programs**
- Learning courses/programs
- 10 categories: Development, Business, Marketing, Lifestyle, Music, Design, Academics, Health & Fitness, Productivity, Accounting
- Difficulty levels: Beginner, Intermediate, Advanced
- Associated quizzes and documentation
- Certificate generation settings
- Instructor assignment
- Pricing (free/paid)

#### 3. **Quizzes**
- Three types: Exam Simulator, Guided Questions, Practice
- Configurable settings (duration, passing marks, retake policy)
- Question management (shuffle, explanations, max attempts)
- Statistics tracking (attempts, average score, completion rate)
- Status: draft, active, archived

#### 4. **Questions**
- Question types: Single choice, Multiple choice, True/False, Short answer
- Options with correct answer marking
- Detailed explanations
- Media attachments (images, videos, audio)
- Difficulty levels & performance stats

#### 5. **QuizAttempts**
- Complete answer tracking
- Scoring with auto-percentage calculation
- Time tracking (allocated vs taken)
- Pass/fail determination
- AI help usage tracking
- Performance metrics (correct/incorrect/skipped)

#### 6. **Certificates**
- Auto-generated certificate numbers (LGPT-2025-000001)
- Unique verification codes
- Performance snapshots
- PDF generation support
- Validity & revocation management

#### 7. **AIChats**
- Session-based AI conversations
- Context-aware (general, program, quiz, question)
- Message history with metadata
- Token usage tracking
- User feedback & ratings

#### 8. **Instructors**
- Professional profiles & credentials
- Portfolio uploads
- Education & certifications
- Social media links
- Approval workflow (pending/approved/rejected)
- Statistics (students, programs, ratings)

#### 9. **Subscriptions**
- Three plans:
  - **Exam Simulator Only**: 19.99 CAD/month
  - **AI Coach Only**: 19.99 CAD/month
  - **Full Access**: 29.99 CAD/month
- Stripe payment integration
- Monthly/Yearly billing
- Usage limits & tracking
- Auto-renewal & trial support

#### 10. **Reviews**
- User reviews for programs/quizzes/platform
- 1-5 star ratings
- Quick feedback tags
- Helpful voting system
- Moderation workflow
- Featured reviews

---

## 🔗 Key Relationships

```
USER
  ├─→ enrolledPrograms (M:N with PROGRAM)
  ├─→ quizAttempts (1:N)
  ├─→ certificates (1:N)
  ├─→ aiChats (1:N)
  ├─→ reviews (1:N)
  └─→ subscription (1:1)

PROGRAM
  ├─→ quizzes (1:N)
  ├─→ instructor (N:1)
  └─→ reviews (1:N)

QUIZ
  ├─→ questions (1:N)
  ├─→ attempts (1:N)
  └─→ program (N:1)

QUIZ_ATTEMPT
  ├─→ user (N:1)
  ├─→ quiz (N:1)
  └─→ certificate (1:1 if passed)
```

---

## ✨ Key Features

### For Students/Users
- 🔐 **Authentication**: Email/Password & Google OAuth
- 📚 **Browse Programs**: 10+ categories with search & filters
- 📝 **Take Quizzes**: Exam simulators with timer & scoring
- 🤖 **AI Coach**: Context-aware chatbot for learning support
- 📊 **Progress Tracking**: Stats, achievements, learning goals
- 🎓 **Certificates**: Auto-generated upon course completion
- 💳 **Subscriptions**: Flexible pricing plans
- ⭐ **Reviews**: Rate & review programs/quizzes

### For Instructors
- 📖 **Create Programs**: Full course management
- ❓ **Build Quizzes**: Multiple question types
- 📄 **Upload Materials**: Documentation & resources
- 👥 **Track Students**: Enrollment & completion stats
- 💰 **Monetization**: Support for paid programs

### For Admins
- 👤 **User Management**: Full CRUD operations
- 🎯 **Content Moderation**: Approve programs/quizzes
- 👨‍🏫 **Instructor Approval**: Application review workflow
- 💬 **Review Moderation**: Feature/remove reviews
- 📈 **Analytics**: Platform-wide statistics
- ⚙️ **Settings**: System configuration

---

## 🚀 Getting Started

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup (Already Exists)
```bash
npm install
npm run dev
```

### Environment Variables Required

**Backend (.env)**:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learningpt
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

**Frontend** (already configured):
- Vite auto-loads .env files
- API base URL configured in `src/Api/api.js`

---

## 📡 API Endpoints (To Be Implemented)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/stats` - Get statistics
- `POST /api/users/enroll/:programId` - Enroll in program

### Programs
- `GET /api/programs` - List all programs
- `GET /api/programs/:id` - Get program details
- `POST /api/programs` - Create program (admin/instructor)
- `GET /api/programs/:id/quizzes` - Get program quizzes

### Quizzes
- `GET /api/quizzes` - List all quizzes
- `POST /api/quizzes/:id/start` - Start quiz attempt
- `POST /api/attempts/:id/submit` - Submit quiz

### AI Chat
- `POST /api/ai-chat/session` - Create chat session
- `POST /api/ai-chat/message` - Send message
- `GET /api/ai-chat/sessions` - Get user sessions

### Certificates
- `GET /api/certificates/user/:userId` - Get user certificates
- `POST /api/certificates/generate` - Generate certificate
- `GET /api/certificates/verify/:code` - Verify certificate

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control (RBAC)
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection
- 🔄 Rate limiting (to be implemented)
- 🔄 Helmet security headers (to be implemented)

---

## 🎨 UI Features

- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Modern gradient backgrounds
- ✅ Interactive animations
- ✅ Toast notifications
- ✅ Modal dialogs
- ✅ Charts & data visualization
- ✅ Rich text editor
- ✅ Star ratings
- ✅ Progress bars
- ✅ Loading states

---

## 📊 Statistics & Analytics

### User Dashboard Shows:
- Quizzes completed
- Average quiz score
- AI interactions count
- Recent quiz results
- Learning goals progress
- Achievements earned

### Admin Dashboard Shows:
- Total users
- Total programs
- Total quizzes
- Revenue metrics
- User engagement stats
- Popular programs

---

## 💰 Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | Limited access (3 AI chats) |
| **Exam Simulator Only** | $19.99 CAD/month | Unlimited exam practice |
| **AI Coach Only** | $19.99 CAD/month | Unlimited AI assistance |
| **Full Access** | $29.99 CAD/month | All features (Best Value) |

---

## 📈 Future Enhancements

1. **Mobile App**: React Native companion app
2. **Live Classes**: Real-time instructor sessions
3. **Gamification**: Badges, leaderboards, streaks
4. **Social Features**: Study groups, forums
5. **Advanced Analytics**: Detailed learning insights
6. **Multi-language**: i18n support
7. **Video Lessons**: Integrated video content
8. **API for Developers**: Public API access

---

## 📚 Documentation Files

### Backend Documentation (NEW!)
- **README.md**: Complete backend overview
- **DATABASE_OVERVIEW.md**: Detailed schema documentation
- **DATABASE_DIAGRAM.md**: Visual ER diagrams
- **QUICKSTART.md**: Step-by-step setup guide
- **.env.example**: Environment variables template

### Frontend Documentation (Existing)
- **README.md**: Project overview
- **package.json**: Dependencies & scripts

---

## 🛠️ Tech Stack Summary

### Frontend
- React 18, Vite, Redux Toolkit
- Tailwind CSS, Lucide Icons
- React Router DOM, Chart.js
- Axios, Redux Persist

### Backend
- Node.js, Express.js
- MongoDB, Mongoose
- JWT, bcryptjs
- Multer, Cloudinary
- Stripe

### DevOps (Future)
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (Reverse proxy)
- PM2 (Process manager)

---

## 👨‍💻 Development Team Roles

### Full Stack Developer
- Frontend React development
- Backend API development
- Database design
- Integration

### UI/UX Designer
- Mockups & wireframes
- User experience optimization
- Brand identity

### DevOps Engineer
- Server setup & deployment
- CI/CD pipelines
- Monitoring & logging

### QA Engineer
- Testing (unit, integration, E2E)
- Bug tracking
- Performance testing

---

## 📞 Support & Resources

### Documentation
- See `backend/README.md` for API details
- See `backend/DATABASE_OVERVIEW.md` for schema
- See `backend/QUICKSTART.md` for setup

### External Resources
- [React Docs](https://react.dev/)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)

---

## 📝 License

ISC

---

**LearninGPT** - Empowering learners worldwide with AI-powered education 🚀✨
