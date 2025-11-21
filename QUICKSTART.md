# Quick Start Guide - LearninGPT Backend

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR use MongoDB Atlas (cloud database) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

---

## 🚀 Installation Steps

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages:
- express (Web framework)
- mongoose (MongoDB ODM)
- bcryptjs (Password hashing)
- jsonwebtoken (Authentication)
- cors (Cross-origin requests)
- dotenv (Environment variables)
- And more...

### 3. Setup Environment Variables
```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Server
PORT=5000
NODE_ENV=development

# Database - Choose one:
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/learningpt

# Option 2: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learningpt

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your_super_secret_jwt_key_change_me_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Optional: For production features
# EMAIL_HOST=smtp.gmail.com
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# STRIPE_SECRET_KEY=sk_test_...
```

### 4. Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod

# Or on MacOS with Homebrew:
brew services start mongodb-community

# Or on Windows:
# MongoDB runs as a service automatically
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Whitelist your IP address
5. Update `MONGODB_URI` in `.env`

### 5. Start the Backend Server

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

You should see:
```
🚀 Server running on port 5000
📡 Environment: development
✅ MongoDB Connected Successfully: localhost:27017
```

---

## 🧪 Test the API

### Check Server Health
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "LearninGPT API is running",
  "timestamp": "2025-11-19T..."
}
```

### Using Postman or Insomnia
Import the following endpoints:
- GET `http://localhost:5000/api/health` - Health check
- POST `http://localhost:5000/api/auth/register` - User registration (coming soon)
- POST `http://localhost:5000/api/auth/login` - User login (coming soon)

---

## 📁 Project Structure Overview

```
backend/
├── models/              # Database schemas
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
├── routes/              # API endpoints
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── quiz.routes.js
│   └── ... (more routes)
│
├── config/              # Configuration
│   └── database.js
│
├── server.js            # Main entry point
├── package.json
├── .env                 # Environment variables (create this)
├── .env.example         # Template
└── README.md
```

---

## 🔧 Development Workflow

### 1. Create Controllers (Next Step)
```bash
mkdir controllers
touch controllers/auth.controller.js
```

Example controller:
```javascript
// controllers/auth.controller.js
import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }
    
    // Create user (password will be hashed automatically)
    const user = await User.create({ name, email, password });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
```

### 2. Create Middleware
```bash
mkdir middleware
touch middleware/auth.middleware.js
```

Example middleware:
```javascript
// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }
    next();
  };
};
```

### 3. Update Routes
```javascript
// routes/auth.routes.js
import express from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
```

---

## 📊 Database Commands

### MongoDB Shell Commands
```bash
# Connect to MongoDB
mongosh

# Use database
use learningpt

# Show collections
show collections

# Find all users
db.users.find()

# Count documents
db.users.countDocuments()

# Create index
db.users.createIndex({ email: 1 }, { unique: true })

# Drop collection
db.users.drop()

# Drop database
db.dropDatabase()
```

### Using Mongoose in Code
```javascript
import User from './models/User.model.js';

// Create
const user = await User.create({ name: 'John', email: 'john@example.com', password: '123456' });

// Find
const users = await User.find();
const user = await User.findById(id);
const user = await User.findOne({ email: 'john@example.com' });

// Update
await User.findByIdAndUpdate(id, { name: 'John Doe' });

// Delete
await User.findByIdAndDelete(id);

// Count
const count = await User.countDocuments();

// With population
const user = await User.findById(id).populate('enrolledPrograms.program');
```

---

## 🛠️ Common Issues & Solutions

### Issue 1: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env
PORT=5001
```

### Issue 2: MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
mongod  # or
brew services start mongodb-community  # Mac
```

### Issue 3: Module Not Found
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

1. ✅ **Complete Controllers**: Implement all CRUD operations
2. ✅ **Add Validation**: Use express-validator for input validation
3. ✅ **Error Handling**: Create custom error classes
4. ✅ **Testing**: Write unit tests with Jest
5. ✅ **Documentation**: Add Swagger/OpenAPI docs
6. ✅ **Security**: Add helmet, rate limiting, CORS
7. ✅ **File Upload**: Implement Cloudinary integration
8. ✅ **Email Service**: Setup nodemailer for notifications
9. ✅ **AI Integration**: Connect OpenAI/Mistral API
10. ✅ **Payment**: Implement Stripe checkout

---

## 🔗 Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 📞 Support

For issues or questions:
- Check `README.md` for detailed documentation
- Review `DATABASE_OVERVIEW.md` for schema details
- See `DATABASE_DIAGRAM.md` for visual representation

---

**Happy Coding! 🚀**
