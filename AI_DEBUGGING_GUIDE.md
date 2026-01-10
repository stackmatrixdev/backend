# 🔍 AI API Integration - Debugging Guide

## Problem: No Request Sent to AI API

If you're asking questions but not seeing any API requests or responses, follow this debugging guide.

---

## Step 1: Check Browser Console (F12)

### Open DevTools
1. Press **F12** (or Ctrl+Shift+I on Windows/Linux, Cmd+Option+I on Mac)
2. Go to **Console** tab
3. Send a message to the AI

### Look for These Messages

**Good Signs:**
```
📤 Sending message to AI API...
Session ID: 550e8400-e29b-41d4-a716-446655440000
Skill Level: beginner
Message: What is React?
🔄 Calling external AI API...
Endpoint: http://10.10.7.82:8008/api/v1/chat/
Request payload: {message: "What is React?", skill_level: "beginner", session_id: "..."}
✅ API Response received: {response: "...", sources: [...], metadata: {...}}
```

**Bad Signs (Errors):**
```
❌ Session ID is not initialized!
❌ Error sending message to external AI: ...
❌ API Error: ...
❌ Exception occurred: ...
```

---

## Step 2: Check Network Tab

### Open Network Tab in DevTools
1. Press **F12**
2. Go to **Network** tab
3. Make sure it's recording (red circle button)
4. Send a message to the AI

### Look for Request to AI API

**Expected:**
- URL: `http://10.10.7.82:8008/api/v1/chat/`
- Method: `POST`
- Status: `200` (success) or `4xx`/`5xx` (error)

**If you DON'T see this request:**
- The API call is not being made
- Check console for error messages (above)

**If you DO see this request:**
- Click on it to view details:
  - **Headers tab:** See request headers
  - **Payload tab:** See what data was sent
  - **Response tab:** See what server returned

---

## Step 3: Common Issues & Solutions

### Issue 1: "Session ID is not initialized!"

**Problem:** The session ID wasn't generated when component loaded.

**Solution:**
```javascript
// Reload the page
window.location.reload();
```

Then check console for:
```
📤 Sending message to AI API...
Session ID: [should be a UUID]
```

---

### Issue 2: Network Request Not Showing

**Problem:** The API call isn't being made at all.

**Possible Causes:**
1. **Message is empty** - Make sure you typed something and sent it
2. **Credits exhausted** - You already sent 3 messages
3. **Session not ready** - Page just loaded, wait a second
4. **Error before API call** - Check console for errors

**Debugging Steps:**
1. Check console for any error messages
2. Check that message input has text
3. Check that credit counter shows > 0
4. Try refreshing page if you see session errors

---

### Issue 3: Request Made but No Response

**Problem:** Request goes to API, but no response comes back.

**Check the Response:**
1. Open Network tab in DevTools
2. Find the `/chat/` request
3. Click on it
4. Go to **Response** tab
5. Check what the server returned

**If Response is Empty:**
- AI API server might be down
- Check if `http://10.10.7.82:8008` is accessible

**If Response has Error:**
```json
{
  "error": "Invalid request format",
  "message": "..."
}
```
- The request format might be wrong
- Check the payload being sent matches expected format

---

### Issue 4: CORS Error in Console

**Error Message:**
```
Access to XMLHttpRequest at 'http://10.10.7.82:8008/api/v1/chat/' from origin 'http://localhost:5175' 
has been blocked by CORS policy
```

**Problem:** AI API server doesn't allow requests from your frontend URL.

**Solution:**
- Contact AI API administrator
- Ask to add `http://localhost:5175` to CORS allowed origins
- OR use a proxy server

---

## Step 4: Verify API Endpoint

### Test if AI API is Accessible

Open terminal and run:

```bash
# Test if API endpoint is reachable
curl -X POST http://10.10.7.82:8008/api/v1/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "skill_level": "beginner",
    "session_id": "test-session-123"
  }'
```

**If you get a response:**
- API is working
- Problem is likely in frontend code

**If you get "Connection refused" or timeout:**
- API server is down or unreachable
- Check IP address and port are correct
- Check if AI server is running

---

## Step 5: Verify Request Format

### Expected Request Format

When you send a message, the frontend should send:

```json
POST http://10.10.7.82:8008/api/v1/chat/
Content-Type: application/json

{
  "message": "What is React?",
  "skill_level": "beginner",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### To Verify in Browser DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Send a message
4. Click on `/chat/` request
5. Go to **Payload** or **Request** tab
6. Verify you see:
   - `message`: Your question
   - `skill_level`: "beginner" (or other level)
   - `session_id`: A UUID (long string with dashes)

---

## Step 6: Verify Response Format

### Expected Response Format

When API responds successfully, you should see:

```json
{
  "response": "React is a JavaScript library...",
  "sources": [
    {
      "module": "React Fundamentals",
      "chunk_id": "chunk_001",
      "relevance": 0.95,
      "content_preview": "React is a declarative..."
    }
  ],
  "metadata": {
    "model_used": "gpt-4",
    "response_time_ms": 234,
    "tokens_used": 156,
    "skill_level": "beginner"
  }
}
```

### To View in Browser DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click on `/chat/` request
4. Go to **Response** tab
5. You should see the JSON response above

---

## Console Logging Checklist

### When You Send a Message, You Should See:

✅ **Step 1: User Clicks Send**
```
📤 Sending message to AI API...
Session ID: [UUID]
Skill Level: beginner
Message: [Your message]
```

✅ **Step 2: API Client Prepares Request**
```
🔄 Calling external AI API...
Endpoint: http://10.10.7.82:8008/api/v1/chat/
Request payload: {message: "...", skill_level: "beginner", session_id: "..."}
```

✅ **Step 3: API Responds**
```
✅ API Response received: {response: "...", sources: [...], metadata: {...}}
✅ AI Response received: [The actual response text]
```

---

## If You See These Errors

### Error: "Session ID is not initialized!"
```
❌ Session ID is not initialized!
```
**Fix:** Reload page. Session should initialize on component mount.

---

### Error: "Failed to resolve import 'uuid'"
```
❌ Failed to resolve import "uuid"
```
**Fix:** Already resolved! We installed uuid package.

---

### Error: Network Error
```
❌ Error sending message to external AI: Error: Network Error
```
**Fix:**
- Check internet connection
- Verify AI API server is running
- Check firewall isn't blocking requests

---

### Error: 404 Not Found
```
❌ Error: 404 - Not Found
```
**Fix:**
- Check endpoint URL: should be `http://10.10.7.82:8008/api/v1/chat/`
- Verify `/chat/` path is correct (not `/ai-chat/` or other path)

---

### Error: CORS Policy
```
❌ Access to XMLHttpRequest blocked by CORS policy
```
**Fix:**
- AI API needs to allow your frontend origin
- Contact API administrator to add CORS headers

---

## Quick Debug Command

Copy-paste this in browser console to test API directly:

```javascript
// Test AI API directly from console
const testAiApi = async () => {
  try {
    console.log("Testing AI API...");
    const response = await fetch('http://10.10.7.82:8008/api/v1/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, test message',
        skill_level: 'beginner',
        session_id: 'test-123'
      })
    });
    
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);
  } catch (error) {
    console.error("Error:", error);
  }
};

testAiApi();
```

Run this to see if API is accessible and what error you get.

---

## Checklist for Full Debugging

- [ ] Opened DevTools Console (F12)
- [ ] Sent a message and checked console
- [ ] Looked for "Sending message to AI API..." log
- [ ] Checked Network tab for `/chat/` request
- [ ] Verified request has correct format
- [ ] Verified response came back
- [ ] Checked for error messages
- [ ] Tested API directly with curl command
- [ ] Tested API directly with fetch in console
- [ ] Reloaded page and tried again

---

## If Problem Persists

1. **Take a screenshot** of DevTools Console showing errors
2. **Take a screenshot** of Network tab showing request/response
3. **Note the exact error message** you see
4. **Provide:**
   - What message you sent
   - What error you see
   - Screenshots of console and network tab

Then we can debug further!

---

## Key Points to Remember

✅ **Session ID must be initialized** - It generates automatically on component load
✅ **Must have credits** - 3 free messages per session (check header counter)
✅ **AI API must be accessible** - http://10.10.7.82:8008 must be reachable
✅ **Request format matters** - Must include message, skill_level, session_id
✅ **Network tab is your friend** - Always check if request is being sent

---

**If you follow these steps, you'll identify the exact issue!** 🔍
