# AI API Integration Testing Guide

## ✅ What Was Updated

The AI Coach integration has been updated to use the real AI API endpoint with the correct request and response format:

### Request Format (Updated)
```json
{
  "message": "What is a Sprint in Scrum?",
  "program_id": "scrum-master",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "skill_level": "beginner"
}
```

### Response Format (Expected)
```json
{
  "response": "A Sprint in Scrum is...",
  "sources": [
    {
      "module": "ENG_Module1_Scrum.docx",
      "chunk_id": 0,
      "relevance": 0.716247022151947,
      "content_preview": "📚 Complete Educational Source..."
    }
  ],
  "metadata": {
    "tokens_used": 718,
    "response_time_ms": 3040,
    "model_used": "gpt-4.1-mini",
    "skill_level": "beginner"
  },
  "follow_up_suggestions": null
}
```

## 🔧 Files Modified

### 1. `/front-end/src/services/api.service.js`
**Function:** `aiChatAPI.sendMessageToExternalAI()`
**Line:** ~336

✅ **Added:**
- `program_id` parameter to the function signature
- `program_id` included in the request payload sent to the API

```javascript
sendMessageToExternalAI: async (message, skillLevel = "beginner", sessionId, programId) => {
  // ... code
  const response = await externalAiClient.post("/chat/", {
    message,
    skill_level: skillLevel,
    session_id: sessionId,
    program_id: programId,  // ✅ NOW INCLUDED
  });
}
```

### 2. `/front-end/src/Pages/Dashboard/GuidedDashboard.jsx`
**Function:** `handleSendMessage()`
**Line:** ~178

✅ **Updated:**
- Now passes `programId` as the 4th parameter when calling the API

```javascript
const result = await aiChatAPI.sendMessageToExternalAI(
  userMessage,
  skillLevel,
  sessionId,
  programId  // ✅ NOW INCLUDED
);
```

## 📋 Complete Feature Checklist

| Feature | Status | Details |
|---------|--------|---------|
| **Request Body** | ✅ Complete | Includes message, skill_level, session_id, program_id |
| **Response Display** | ✅ Complete | Shows AI response text with sources and metadata |
| **Sources Display** | ✅ Complete | Shows module name, relevance %, content preview |
| **Metadata Display** | ✅ Complete | Shows model, response time, tokens used |
| **Free Credits System** | ✅ Complete | 3 free messages, decrements on each AI response |
| **Session Management** | ✅ Complete | UUID v4 session ID generated on component mount |
| **Error Handling** | ✅ Complete | try/catch blocks with error messages |
| **Console Logging** | ✅ Complete | Emoji-based logging for debugging |
| **Typing Indicator** | ✅ Complete | Bouncing dots while waiting for AI response |

## 🧪 Step-by-Step Testing

### Test 1: Basic Message Sending

1. **Open the Application**
   - Navigate to http://localhost:5174
   - Go to Dashboard → AI Coach (Guided tab)

2. **Open Browser Console**
   - Press `F12` to open Developer Tools
   - Click on the "Console" tab
   - You should see no errors initially

3. **Send a Test Message**
   - Click in the message input box
   - Type: `"What is a Sprint in Scrum?"`
   - Press Enter or click the Send button

4. **Watch Console Logs**
   Expected sequence:
   ```
   📤 Sending message to AI API...
   Session ID: [UUID-string]
   Skill Level: beginner
   Message: What is a Sprint in Scrum?
   🔄 Calling external AI API...
   Endpoint: http://10.10.7.82:8008/api/v1/chat/
   Request payload: {message: "What is a Sprint in Scrum?", skill_level: "beginner", ...}
   ✅ API Response received: {response: "A Sprint in Scrum...", sources: [...], ...}
   ✅ AI Response received: "A Sprint in Scrum..."
   Sources: [Array(3)]
   Metadata: {tokens_used: 718, response_time_ms: 3040, ...}
   ```

5. **Verify Response Display**
   - ✅ AI response text appears in chat
   - ✅ Sources section shows 📚 icon with module names and relevance %
   - ✅ Metadata section shows model, response time, tokens used
   - ✅ Free credits counter decrements from 3 to 2

### Test 2: Multiple Messages

1. **Send Second Message**
   - Type: `"How do Sprints relate to Product Backlog?"`
   - Press Enter

2. **Verify Behavior**
   - ✅ Both messages appear in conversation
   - ✅ Free credits now shows: `You have 1 free message remaining`
   - ✅ Console shows correct request payload with new message

3. **Send Third Message**
   - Type: `"What are the Sprint ceremonies?"`
   - Press Enter

4. **Verify Behavior**
   - ✅ Third message appears
   - ✅ Free credits depleted: Shows pricing modal on 4th attempt
   - ✅ Toast notification: "You've used all your free messages. Please upgrade to continue."

### Test 3: Error Handling

1. **Network Error (Simulate Offline)**
   - Open Developer Tools → Network tab
   - Right-click → Throttling → Offline
   - Send a message
   - Check console for error logs: `❌ Error sending message to external AI:`

2. **API Not Responding**
   - If AI server at http://10.10.7.82:8008 is down:
   - Expected error: `Error: Network Error` or `ECONNREFUSED`
   - Console shows: `❌ Error message: [specific error]`

3. **Invalid Response Format**
   - If API returns unexpected format:
   - Console shows response but may not have `.response`, `.sources`, `.metadata`
   - Component handles gracefully with `result.data.sources || []`

### Test 4: Network Tab Verification

1. **Open Developer Tools → Network Tab**

2. **Send a Message**

3. **Look for Request**
   - URL: `http://10.10.7.82:8008/api/v1/chat/`
   - Method: `POST`
   - Status: `200` (if successful) or error code
   - Request Headers:
     - `Content-Type: application/json`
   - Request Body (should show):
     ```json
     {
       "message": "Your message here",
       "skill_level": "beginner",
       "session_id": "UUID-string",
       "program_id": "scrum-master"
     }
     ```
   - Response:
     - Status: `200 OK`
     - Shows full response JSON with response, sources, metadata

## 🔍 Troubleshooting

### Issue: No Console Logs Appearing

**Solution:**
1. Make sure console is open (F12 → Console tab)
2. Refresh page (F5)
3. Verify session ID appears on load
4. Try sending a message again

### Issue: "Session ID is not initialized!" Error

**Solution:**
1. This means `sessionId` state variable is null
2. Possible causes:
   - UUID package not imported correctly
   - useEffect not running on component mount
3. **Fix:**
   ```bash
   cd /home/root_coder/Downloads/demo/backend/front-end
   npm list uuid  # Should show uuid version
   ```
4. If missing, install: `npm install uuid`
5. Refresh page (F5)

### Issue: Request Sent but No Response (Hangs)

**Symptoms:**
- 🔄 "Calling external AI API..." appears in console
- But no ✅ or ❌ response appears
- Typing indicator keeps animating

**Solutions:**

1. **Check if AI Server is Running**
   ```bash
   # Test connectivity to AI server
   curl -X POST http://10.10.7.82:8008/api/v1/chat/ \
     -H "Content-Type: application/json" \
     -d '{
       "message": "test",
       "skill_level": "beginner",
       "session_id": "test-id",
       "program_id": "test"
     }'
   ```

2. **Check API Response Time**
   - Look in Network tab for the POST request
   - Check "Time" column - should complete in < 10 seconds
   - If it's pending, AI server may be slow or not responding

3. **CORS Issues**
   - If you see CORS error in console:
   - Contact API admin to enable CORS headers
   - Required headers: `Access-Control-Allow-Origin: *`

### Issue: "Failed to get AI response" Error

**Possible Causes:**
1. API endpoint is incorrect (double-check http://10.10.7.82:8008)
2. Request format is wrong (missing required fields)
3. API server encountered an error
4. Network connectivity issue

**Check Console For:**
```
❌ Error sending message to external AI:
Error message: [specific error]
Error response: {status: 404, data: {...}}
Error config: {url: "http://10.10.7.82:8008/api/v1/chat/", ...}
```

## 📊 Expected Behavior After Update

### ✅ What Should Work Now

1. **Message Sending**
   - Type message → Press Enter → Message appears immediately in blue chat bubble
   - Typing indicator (3 bouncing dots) appears below AI

2. **API Request**
   - Console shows 📤 and 🔄 logs
   - Network tab shows POST to `http://10.10.7.82:8008/api/v1/chat/`
   - Request includes: message, skill_level, session_id, **program_id** ✅

3. **AI Response**
   - After ~2-5 seconds, response appears in gray chat bubble
   - If API returns sources, they display below the response
   - If API returns metadata, it shows at bottom

4. **Credit System**
   - First 3 messages: Free (shows "Remaining 1/3")
   - 4th message: Pricing modal appears
   - Must upgrade to continue

5. **Console Logging**
   - Shows clear emoji indicators: 📤 🔄 ✅ ❌
   - Logs help identify where requests succeed or fail

## 🚀 Next Steps

1. **Test with Real AI Server**
   - Confirm server is running at http://10.10.7.82:8008
   - Server must accept the exact request format shown above
   - Should return response with `response`, `sources`, `metadata` fields

2. **Monitor Network**
   - Open DevTools Network tab
   - Watch for POST requests to `/api/v1/chat/`
   - Verify status is 200 and response time is reasonable

3. **Debug Issues**
   - Use console logs with emoji indicators
   - Check Network tab for request/response details
   - Refer to troubleshooting section above

4. **Test Different Skill Levels**
   - Update `skillLevel` state variable
   - Currently hardcoded to "beginner"
   - Can be enhanced to accept user input later

## 📝 Code Locations

| Component | File | Function | Line |
|-----------|------|----------|------|
| **API Service** | `/front-end/src/services/api.service.js` | `sendMessageToExternalAI()` | ~336 |
| **Chat Component** | `/front-end/src/Pages/Dashboard/GuidedDashboard.jsx` | `handleSendMessage()` | ~178 |
| **Session Init** | `/front-end/src/Pages/Dashboard/GuidedDashboard.jsx` | `useEffect()` | ~52-65 |
| **Message Rendering** | `/front-end/src/Pages/Dashboard/GuidedDashboard.jsx` | `conversations.map()` | ~555 |
| **Sources Display** | `/front-end/src/Pages/Dashboard/GuidedDashboard.jsx` | Conditional render | ~596 |
| **Metadata Display** | `/front-end/src/Pages/Dashboard/GuidedDashboard.jsx` | Conditional render | ~613 |

## ✨ Summary

The AI Coach is now fully integrated with the real AI API endpoint. The implementation includes:

- ✅ Complete request format with all 4 parameters
- ✅ Response parsing for response, sources, and metadata
- ✅ Visual display of all response components
- ✅ Credit system to track free messages
- ✅ Comprehensive console logging for debugging
- ✅ Error handling with user-friendly messages
- ✅ Typing indicator while waiting for response

**Start testing by opening DevTools (F12) and sending a message to see the full request/response flow!**
