# Swagger API Documentation Guide

## 📚 Overview

All API documentation is now centralized in `/config/swagger.js` - keeping your route files clean and easy to read!

## 🚀 Accessing the Documentation

### Local Development
Once the server is running, access the interactive Swagger UI at:
```
http://localhost:3000/api-docs
```

### Production
```
https://api.learngpt.com/api-docs
```

## 🎯 Features

- **Interactive Testing**: Test all endpoints directly from the browser
- **Authentication Support**: Easily add Bearer tokens for protected routes
- **Request/Response Examples**: See exactly what data to send and expect
- **Schema Definitions**: Complete data models for User, Topic, Program, Question

## 🔑 How to Use Authentication

1. First, register and login to get your access token
2. Click the **"Authorize"** button at the top right of Swagger UI
3. Enter your token in the format: `Bearer YOUR_ACCESS_TOKEN`
4. Click "Authorize"
5. Now all protected endpoints will include your token automatically!

## 📋 Available API Sections

### 1. Authentication
- Register new user
- Verify email with OTP
- Login
- Refresh access token
- Logout
- Forgot password
- Reset password

### 2. Users & Profile
- Get user profile
- Update profile (name, email, password)
- Upload profile image
- Delete profile image
- Get user statistics (student dashboard)
- Record AI interactions

### 3. Topics
- Create topic with pricing
- Get all topics (with filters)
- Get single topic
- Update topic
- Delete topic

### 4. Programs
- Create learning program
- Get all programs (with filters)
- Get single program
- Update program
- Delete program

### 5. Questions & Quizzes
- Get quiz preview
- Add question to program
- Update question
- Delete question
- Delete entire quiz

## 🛠️ Updating the Documentation

All documentation is in **one file**: `/config/swagger.js`

To add or modify endpoints:
1. Open `/config/swagger.js`
2. Find the `paths` section
3. Add/modify your endpoint following the OpenAPI 3.0 format

Example:
```javascript
"/api/your-new-endpoint": {
  post: {
    tags: ["YourTag"],
    summary: "Short description",
    description: "Detailed description",
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["field1"],
            properties: {
              field1: { type: "string", example: "value" }
            }
          }
        }
      }
    },
    responses: {
      200: { description: "Success" },
      400: { description: "Error" }
    }
  }
}
```

## 📝 Benefits of Centralized Documentation

✅ **Clean Code**: No more cluttered route files with long comments  
✅ **Easy Maintenance**: All docs in one place  
✅ **Better Organization**: Grouped by API sections  
✅ **Version Control**: Easier to track documentation changes  
✅ **Frontend Friendly**: Developers can access live, interactive docs  

## 🔄 Alternative: Export OpenAPI Spec

You can also export the raw OpenAPI spec as JSON:
```javascript
// Add this route in server.js if needed
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});
```

Then access: `http://localhost:3000/api-docs.json`

## 💡 Tips

- Use the "Try it out" button to test endpoints
- Check the "Schemas" section at the bottom for data models
- Response codes help understand success/error states
- Filter endpoints by tag using the top navigation

## 🎨 Customization

The Swagger UI is already customized in `server.js`:
- Top bar is hidden
- Deep linking is enabled
- Persistent authorization
- Syntax highlighting

---

**Happy Coding! 🚀**

Your route files are now clean and your documentation is comprehensive!
