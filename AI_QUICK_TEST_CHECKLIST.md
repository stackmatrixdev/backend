# ✅ AI API Integration - Quick Test Checklist

## Before Testing

- [ ] Frontend dev server running on http://localhost:5175
- [ ] You have access to browser DevTools (F12)
- [ ] AI API endpoint accessible: http://10.10.7.82:8008
- [ ] Page loaded without console errors

---

## Step-by-Step Test

### 1. Open Browser DevTools
- [ ] Press **F12**
- [ ] Go to **Console** tab
- [ ] Go to **Network** tab (keep both visible)
- [ ] In Network tab, click red circle to start recording

### 2. Navigate to AI Coach
- [ ] Go to any course page
- [ ] Click "AI Coach" tab
- [ ] Wait for page to fully load

### 3. Check Initial Logs
In Console, you should see:
- [ ] No errors about session initialization
- [ ] No "Cannot find uuid" errors
- [ ] No other red error messages

### 4. Send a Message
- [ ] Type a question: "What is React?"
- [ ] Press Enter or click Send
- [ ] **IMMEDIATELY** watch both Console and Network tabs

### 5. Check Console Logs

Look for these messages in order:

**Expected Sequence:**
```
1. 📤 Sending message to AI API...
2. Session ID: [UUID]
3. Skill Level: beginner
4. Message: What is React?
5. 🔄 Calling external AI API...
6. Endpoint: http://10.10.7.82:8008/api/v1/chat/
7. Request payload: {...}
8. ✅ API Response received: {...}
9. ✅ AI Response received: [response text]
```

### 6. Check Network Tab

Look for POST request to:
- [ ] URL: `http://10.10.7.82:8008/api/v1/chat/`
- [ ] Method: `POST`
- [ ] Status: Should be **200** (or error code like 4xx/5xx)

### 7. Verify Response Appears

In the app:
- [ ] Typing indicator appears
- [ ] AI response displays in gray bubble
- [ ] Sources section appears (if API returns them)
- [ ] Metadata section appears (if API returns it)
- [ ] Credit counter decreases (3 → 2)

### 8. Check Message Format in Network Tab

Click on the `/chat/` request in Network tab:
- [ ] Go to **Payload** or **Request Body** tab
- [ ] You should see:
  ```json
  {
    "message": "What is React?",
    "skill_level": "beginner",
    "session_id": "[UUID]"
  }
  ```

### 9. Check Response in Network Tab

Click on the `/chat/` request in Network tab:
- [ ] Go to **Response** tab
- [ ] You should see JSON with:
  - `response`: The AI's answer
  - `sources`: Array of sources (optional)
  - `metadata`: Object with model info (optional)

---

## Expected Results

### ✅ Success Scenario

**Console shows:**
```
📤 Sending message to AI API...
Session ID: 550e8400-e29b-41d4-a716-446655440000
Skill Level: beginner
Message: What is React?
🔄 Calling external AI API...
Endpoint: http://10.10.7.82:8008/api/v1/chat/
Request payload: {message: "What is React?", skill_level: "beginner", session_id: "550e8400-e29b-41d4-a716-446655440000"}
✅ API Response received: {response: "React is a JavaScript library...", sources: [...], metadata: {...}}
✅ AI Response received: React is a JavaScript library...
```

**Network tab shows:**
- Request to `http://10.10.7.82:8008/api/v1/chat/` with status **200**

**App shows:**
- AI response in gray bubble
- Credit counter changed from 3 to 2

---

### ❌ Failure Scenarios

#### Failure 1: No Request Sent

**Console shows:**
```
❌ Session ID is not initialized!
```

**Solution:** Reload page and wait for session to initialize.

---

#### Failure 2: Request Sent but No Response

**Console shows:**
```
📤 Sending message to AI API...
🔄 Calling external AI API...
❌ Error sending message to external AI: Error: Network Error
```

**Network tab shows:**
- Request sent but times out or shows error status

**Solution:** 
- Check AI API server is running
- Check http://10.10.7.82:8008 is accessible
- Check firewall isn't blocking

---

#### Failure 3: CORS Error

**Console shows:**
```
❌ Error sending message to external AI: Error: Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- AI API needs CORS headers
- Contact API administrator to enable CORS for localhost:5175

---

#### Failure 4: Wrong API Response Format

**Console shows:**
```
✅ API Response received: {error: "Invalid request format"}
```

**Network tab shows:**
- Status: 400 or similar error

**Solution:**
- Check request format matches what API expects
- Verify fields are correct: message, skill_level, session_id

---

## Minimal Test Script

If you want to test API directly from console:

```javascript
// Copy-paste this entire block in browser console (F12 > Console tab)

const testAiAPI = async () => {
  console.log("🔄 Testing AI API...");
  try {
    const payload = {
      message: "Hello test",
      skill_level: "beginner",
      session_id: "test-session-" + Date.now()
    };
    
    console.log("📤 Sending:", payload);
    
    const response = await fetch('http://10.10.7.82:8008/api/v1/chat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    console.log("📊 Response status:", response.status);
    const data = await response.json();
    console.log("📥 Response data:", data);
    
    if (response.ok) {
      console.log("✅ API IS WORKING!");
    } else {
      console.log("❌ API returned error:", data);
    }
  } catch (error) {
    console.log("❌ NETWORK ERROR:", error.message);
  }
};

testAiAPI();
```

---

## Credit System Test

After fixing the API issue:

- [ ] Send message 1 → Credit counter: 2/3
- [ ] Send message 2 → Credit counter: 1/3
- [ ] Send message 3 → Credit counter: 0/3
- [ ] Try to send message 4 → See error: "You've used all your free messages"

---

## Sources & Metadata Test

If API returns sources and metadata:

- [ ] Sources section displays below AI response
  - [ ] Shows module name
  - [ ] Shows relevance percentage
  - [ ] Shows content preview
  
- [ ] Metadata section displays
  - [ ] Shows model used
  - [ ] Shows response time
  - [ ] Shows tokens used

---

## What to Provide if Still Not Working

If the issue persists, provide:

1. **Screenshot of Console Tab** showing errors
2. **Screenshot of Network Tab** showing the request
3. **Copy of error message** from console
4. **The exact message** you sent to AI
5. **Your IP/Location** (helps determine API reachability)

---

## Summary

✅ **The debugging is now built into the code with console logs**
✅ **Just open F12 and check the console while sending a message**
✅ **Every step is logged with emoji for easy identification**
✅ **Network tab will show if request reaches the API**
✅ **If API is working, response will appear immediately**

**Start with this checklist and the console logs will guide you!** 🔍
