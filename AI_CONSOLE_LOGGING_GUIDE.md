# 🔧 AI API Debugging - Updated Code with Console Logging

## What Was Fixed

I've added comprehensive console logging to track every step of the API call. This will help us identify exactly where the problem is.

### Updated Files
1. **GuidedDashboard.jsx** - Added logging to `handleSendMessage()`
2. **api.service.js** - Added logging to `sendMessageToExternalAI()`

---

## How to Test Now

### Step 1: Open Browser DevTools
```
Press: F12 (Windows/Linux) or Cmd+Option+I (Mac)
```

### Step 2: Go to Console Tab
- Click the **Console** tab in DevTools

### Step 3: Send a Message to AI
- Navigate to any course → AI Coach tab
- Type a question: "What is React?"
- Press Enter or click Send

### Step 4: Watch the Console

You should see messages like:

**If Everything Works:** ✅
```
📤 Sending message to AI API...
Session ID: 550e8400-e29b-41d4-a716-446655440000
Skill Level: beginner
Message: What is React?
🔄 Calling external AI API...
Endpoint: http://10.10.7.82:8008/api/v1/chat/
Request payload: {message: "What is React?", skill_level: "beginner", session_id: "..."}
✅ API Response received: {response: "React is a JavaScript library...", ...}
✅ AI Response received: React is a JavaScript library...
```

**If There's a Problem:** ❌
```
❌ Session ID is not initialized!
❌ Error sending message to external AI: Error: Network Error
❌ API Error: Failed to connect
```

---

## Console Log Legend

| Icon | Meaning |
|------|---------|
| 📤 | Sending request to API |
| 🔄 | Processing/Loading |
| ✅ | Success |
| ❌ | Error |

---

## What Each Log Means

### 📤 Sending message to AI API...
- **Means:** User clicked send and validation passed
- **Check:** Message is typed and has content

### Session ID: [UUID]
- **Means:** The unique session ID for this conversation
- **If missing:** Session wasn't initialized (reload page)

### 🔄 Calling external AI API...
- **Means:** About to make HTTP request to AI server
- **Endpoint:** Shows the URL being called
- **Request payload:** Shows exact data being sent

### ✅ API Response received
- **Means:** Server responded (status 200-299)
- **Shows:** The actual response data from AI

### ❌ Error sending message
- **Means:** Something went wrong
- **Shows:** What error occurred

---

## Common Console Messages & What They Mean

### Message 1: "Session ID is not initialized!"
```
❌ Session ID is not initialized!
```
**Cause:** Component just loaded, session not created yet  
**Fix:** Wait a second or reload page  
**Action:** Try sending message again

---

### Message 2: "Failed to resolve import 'uuid'"
```
Failed to resolve import "uuid"
```
**Cause:** uuid package not installed  
**Fix:** Already fixed! We ran `npm install uuid`  
**Action:** Clear browser cache (Ctrl+Shift+Delete) and reload

---

### Message 3: "Network Error"
```
❌ Error sending message to external AI: Error: Network Error
Error config: {url: "http://10.10.7.82:8008/api/v1/chat/", ...}
```
**Cause:** Can't reach AI API server  
**Fix:** Check if http://10.10.7.82:8008 is reachable  
**Action:** Run in terminal:
```bash
curl http://10.10.7.82:8008
```

---

### Message 4: "Failed to get AI response"
```
❌ Error sending message to external AI: Error: Failed to get AI response
Error response: {status: 404, statusText: "Not Found"}
```
**Cause:** Wrong endpoint path  
**Fix:** Verify `/chat/` path is correct  
**Action:** Check API documentation

---

### Message 5: "CORS policy"
```
❌ Access to XMLHttpRequest blocked by CORS policy
```
**Cause:** AI API doesn't allow requests from this origin  
**Fix:** Contact AI API admin to enable CORS  
**Action:** Request CORS headers for localhost:5174

---

## Step-by-Step Debugging Flow

### 1️⃣ Does Console Show Initial Logs?

**YES** → Go to Step 2  
**NO** → Issue: Component not loading properly
- [ ] Check browser console for errors
- [ ] Reload page
- [ ] Try different browser

---

### 2️⃣ Does Session ID Show in Logs?

**YES** → Go to Step 3  
**NO** → Issue: Session not initialized
- [ ] Wait 1 second after page load
- [ ] Reload page
- [ ] Check for "Error initializing session" in console

---

### 3️⃣ Does "Calling external AI API..." Show?

**YES** → Go to Step 4  
**NO** → Issue: Request not being made
- [ ] Message might be empty
- [ ] Credits might be exhausted
- [ ] Check for error messages above

---

### 4️⃣ Does "API Response received" Show?

**YES** → ✅ **IT'S WORKING!** Go to Step 5  
**NO** → Issue: Server not responding
- [ ] Check Network tab in DevTools
- [ ] Check if API server is running
- [ ] Check if IP address is correct

---

### 5️⃣ Does Response Appear in Chat?

**YES** → ✅ **EVERYTHING WORKS!**  
**NO** → Issue: Response parsing problem
- [ ] Check console for parsing errors
- [ ] Check response format is correct
- [ ] Check if response has `response` field

---

## What to Check in Browser DevTools

### Console Tab
- [x] All the emoji logs are printing
- [x] No red error messages
- [x] Session ID is showing

### Network Tab
1. Send a message
2. Look for request to: `http://10.10.7.82:8008/api/v1/chat/`
3. Check:
   - **Status:** Should be 200 (or error code)
   - **Method:** Should be POST
   - **Headers:** Content-Type should be application/json
   - **Payload:** Should have message, skill_level, session_id
   - **Response:** Should have response, sources, metadata

---

## Quick Fix Checklist

- [ ] Dev server running (port 5174)
- [ ] Page loads without errors
- [ ] DevTools Console open (F12)
- [ ] Send a message and watch console
- [ ] Look for 📤, 🔄, ✅ or ❌ logs
- [ ] If ❌, note the error message
- [ ] Check Network tab for API request

---

## Copy-Paste Debugging Commands

### Test API Directly in Console

```javascript
// Paste this in browser console (F12)
fetch('http://10.10.7.82:8008/api/v1/chat/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello',
    skill_level: 'beginner',
    session_id: 'test-' + Date.now()
  })
}).then(r => {
  console.log('Status:', r.status);
  return r.json();
}).then(d => console.log('Response:', d)).catch(e => console.error('Error:', e));
```

This will show if API is accessible at all.

---

## If Still Not Working

1. **Take Screenshot of Console** - Full console output showing all logs and errors
2. **Take Screenshot of Network Tab** - Showing the /chat/ request
3. **Share the Error Messages** - Copy-paste exact error text
4. **Tell Me:**
   - [ ] What message did you send?
   - [ ] What error appeared in console?
   - [ ] Did Network tab show a request to the API?
   - [ ] What was the HTTP status code?

Then I can provide more specific fixes!

---

## Summary

✅ **Comprehensive logging added to track every step**  
✅ **Console logs will show exactly where the issue is**  
✅ **Network tab will show if request reaches API**  
✅ **Error messages are descriptive and helpful**  

**Just follow the console logs and they'll guide you to the solution!** 🚀

---

## Files Updated

- **GuidedDashboard.jsx** - Added console logs and try/catch
- **api.service.js** - Added console logs to API call

## Files Created for Reference

- **AI_DEBUGGING_GUIDE.md** - Detailed debugging procedures
- **AI_QUICK_TEST_CHECKLIST.md** - Step-by-step test checklist
- **This file** - Console logging guide

---

**Frontend URL:** http://localhost:5174  
**Dev Server Status:** Running ✅  
**Ready to Test:** YES ✅

Go test and check the console! The logs will tell us exactly what's happening. 🔍
