# 🚀 Quick Reference - Swagger Documentation

## Access Documentation
```
http://localhost:5000/api-docs
```

## File Locations
- **Swagger Config:** `/config/swagger.js`
- **Auth Routes:** `/routes/auth.routes.js` (30 lines - CLEAN!)
- **User Routes:** `/routes/user.routes.js` (41 lines - CLEAN!)

## Quick Start
1. Start server: `npm run dev` or `npm start`
2. Open: http://localhost:5000/api-docs
3. Click "Authorize" button
4. Enter: `Bearer YOUR_TOKEN`
5. Test endpoints!

## API Endpoints Summary

### Authentication (7 endpoints)
```
POST /api/auth/register          - Register user
POST /api/auth/verify-otp        - Verify email
POST /api/auth/login             - Login
POST /api/auth/refresh           - Refresh token
POST /api/auth/logout            - Logout (🔒)
POST /api/auth/forgot-password   - Request reset
POST /api/auth/reset-password    - Reset password
```

### Users (6 endpoints)
```
GET    /api/users/profile        - Get profile (🔒)
PUT    /api/users/profile        - Update profile (🔒)
POST   /api/users/profile/image  - Upload image (🔒)
DELETE /api/users/profile/image  - Delete image (🔒)
GET    /api/users/stats          - Get stats (🔒)
POST   /api/users/ai-interaction - Record AI usage (🔒)
```

### Topics (5 endpoints)
```
POST   /api/topics     - Create topic (🔒)
GET    /api/topics     - Get all topics (🔒)
GET    /api/topics/:id - Get topic (🔒)
PUT    /api/topics/:id - Update topic (🔒)
DELETE /api/topics/:id - Delete topic (🔒)
```

### Programs (5 endpoints)
```
POST   /api/programs     - Create program (🔒)
GET    /api/programs     - Get all programs (🔒)
GET    /api/programs/:id - Get program (🔒)
PUT    /api/programs/:id - Update program (🔒)
DELETE /api/programs/:id - Delete program (🔒)
```

### Questions & Quizzes (5 endpoints)
```
GET    /api/programs/:id/quiz/preview                   - Quiz preview (🔒)
POST   /api/programs/:id/questions                      - Add question (🔒)
PUT    /api/programs/:programId/questions/:questionId   - Update question (🔒)
DELETE /api/programs/:programId/questions/:questionId   - Delete question (🔒)
DELETE /api/programs/:id/quiz                           - Delete quiz (🔒)
```

🔒 = Requires Authentication

## Authentication Flow
```javascript
// 1. Register
POST /api/auth/register
{ "fullname": "John", "email": "john@test.com", "password": "pass123" }

// 2. Verify
POST /api/auth/verify-otp
{ "email": "john@test.com", "otp": "123456" }

// 3. Login
POST /api/auth/login
{ "email": "john@test.com", "password": "pass123" }
→ Returns: { accessToken, refreshToken, user }

// 4. Use token in Swagger
Click "Authorize" → Enter: Bearer <accessToken>
```

## Add New Endpoint
1. Add route (keep clean!):
   ```javascript
   // routes/user.routes.js
   router.get("/new-endpoint", authenticate, Controller.method);
   ```

2. Add docs:
   ```javascript
   // config/swagger.js → paths section
   "/api/users/new-endpoint": {
     get: {
       tags: ["Users"],
       summary: "Description",
       security: [{ bearerAuth: [] }],
       responses: { 200: { description: "Success" } }
     }
   }
   ```

## Common Issues
- **Server not starting?** → Check port 5000, kill existing process
- **Token expired?** → Use refresh endpoint or login again
- **Endpoint not showing?** → Check `/config/swagger.js` paths

## Documentation Files
- `SWAGGER_COMPLETE.md` - Full summary & verification
- `SWAGGER_GUIDE.md` - Detailed usage guide
- `SWAGGER_IMPLEMENTATION_SUMMARY.md` - Technical details
- `QUICK_REFERENCE.md` - This file

---
*LearnGPT API v1.0.0 | December 12, 2025*
