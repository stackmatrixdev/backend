# 🎯 Authentication Integration - Testing Guide

## ✅ Setup Complete!

Both servers are running:
- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:5173

---

## 🔐 Authentication Flow

### 1. **Register New User**

1. Go to: http://localhost:5173/register
2. Fill in the form:
   - **Name**: Your Name
   - **Email**: test@example.com
   - **Password**: test123
   - **Confirm Password**: test123
3. Click **"CREATE ACCOUNT"**
4. You'll receive an OTP via email (check backend console for OTP in development)
5. You'll be redirected to `/otp` page

### 2. **Verify OTP**

1. On the OTP page, enter the 6-digit code
2. Check your email or backend terminal logs for the OTP
3. Enter each digit in the boxes
4. Click **"Verify OTP"**
5. Success! Redirected to `/login`

### 3. **Login**

#### **Normal User Login:**
1. Go to: http://localhost:5173/login
2. Enter credentials:
   - Email: test@example.com
   - Password: test123
3. Click **"LOGIN"**
4. You'll be redirected to home page `/`

#### **Admin Login:**
1. Go to: http://localhost:5173/login
2. Enter admin credentials:
   - Email: admin@gmail.com
   - Password: admin123
3. Click **"LOGIN"**
4. You'll be redirected to admin dashboard `/admin`

---

## 🔍 How It Works

### **User Role Detection:**

The backend returns user data with an `isAdmin` field:

```javascript
// Backend Response
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Admin User",
      "email": "admin@gmail.com",
      "isAdmin": true  // ← This determines redirect
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### **Frontend Logic:**

```javascript
// LoginForm.jsx
if (userData.user?.isAdmin) {
  navigate("/admin");  // Admin goes to dashboard
} else {
  navigate("/");        // Normal user goes to home
}
```

---

## 🗄️ Data Storage

After successful login, the following data is stored:

### **localStorage:**
```json
{
  "auth": {
    "user": {
      "_id": "...",
      "name": "User Name",
      "email": "user@email.com",
      "isAdmin": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### **Redux Store:**
```javascript
{
  auth: {
    isAuthenticated: true,
    user: { ... },
    accessToken: "...",
    refreshToken: "...",
    isAdmin: false
  }
}
```

---

## 🧪 Testing Checklist

- [ ] Register new user
- [ ] Receive OTP email (check backend logs)
- [ ] Verify OTP successfully
- [ ] Login with normal user → Redirect to `/`
- [ ] Login with admin user → Redirect to `/admin`
- [ ] Check localStorage has auth data
- [ ] Check Redux store has user data
- [ ] Try invalid credentials → Show error
- [ ] Try invalid OTP → Show error
- [ ] Form validation works (empty fields, invalid email, password mismatch)

---

## 🐛 Troubleshooting

### **"No response from server"**
- Make sure backend is running on http://localhost:5000
- Check `.env` file has: `VITE_API_URL=http://localhost:5000/api`
- Restart frontend server after changing .env

### **OTP not received**
- Check backend terminal for OTP (in development mode, OTP is printed to console)
- Example log: `Generated OTP: 123456 for user: 507f1f77bcf86cd799439011`

### **CORS errors**
- Backend already has CORS enabled
- If issues persist, check `server.js` has: `app.use(cors())`

### **Token expired**
- Access tokens expire after 1 hour
- Refresh tokens expire after 30 days
- API service automatically refreshes tokens on 401 errors

### **Can't access protected routes**
- Make sure you're logged in
- Check localStorage has `auth` object with `accessToken`
- Check browser console for errors

---

## 📝 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/verify-otp` | POST | Verify email with OTP |
| `/api/auth/login` | POST | Login user |
| `/api/auth/refresh-token` | POST | Refresh access token |

---

## 🔑 Test Credentials

### Create Your Own:
1. Use the register page
2. Use any email (OTP will be in backend logs)

### Admin Access:
You'll need to manually set `isAdmin: true` in MongoDB for a user:

```javascript
// In MongoDB or via backend API
db.users.updateOne(
  { email: "admin@gmail.com" },
  { $set: { isAdmin: true } }
)
```

---

## 🎨 Features Implemented

✅ **Registration with OTP verification**
- Form validation (email, password match, required fields)
- API integration with error handling
- Loading states on buttons
- Success/error toasts

✅ **OTP Verification**
- 6-digit OTP input
- Auto-focus next input
- Email stored in localStorage during process
- Redirect to login after verification

✅ **Login with Role-based Redirect**
- Check if user is admin
- Redirect admin to `/admin`
- Redirect normal users to `/`
- Store tokens in localStorage & Redux
- Form validation
- Loading states

✅ **Token Management**
- Automatic token refresh on 401
- Interceptor adds token to all requests
- Logout clears all data

---

## 🚀 Next Steps

1. **Test the complete flow** (register → OTP → login)
2. **Create an admin user** in database
3. **Test admin login** → should redirect to `/admin`
4. **Test normal user login** → should redirect to `/`
5. **Implement logout** functionality in your UI
6. **Add protected routes** using Redux auth state

---

## 💡 Usage Examples

### **Check if user is logged in:**
```javascript
import { useSelector } from 'react-redux';

const { isAuthenticated, user, isAdmin } = useSelector((state) => state.auth);

if (isAuthenticated) {
  // User is logged in
  if (isAdmin) {
    // This is an admin
  }
}
```

### **Logout:**
```javascript
import { useDispatch } from 'react-redux';
import { logout } from './Stores/authSlice';

const dispatch = useDispatch();

const handleLogout = () => {
  dispatch(logout());
  // This will clear localStorage and redirect to login
};
```

### **Protected Route:**
```javascript
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};
```

---

**Happy Testing! 🎉**
