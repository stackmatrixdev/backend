# Real AI Chat Integration - Testing Guide

## Quick Start

### 1. Verify Frontend Server is Running
```bash
cd /home/root_coder/Downloads/demo/backend/front-end
npm run dev
# Should output: VITE v6.4.1 ready in XXX ms
# Local: http://localhost:5174 or http://localhost:5173
```

### 2. Access the Application
Open browser and navigate to:
- **Local:** `http://localhost:5174` (or the port shown in terminal)
- **Network:** `http://10.10.7.57:5174/`

### 3. Navigate to AI Coach
- Login with test account (or register)
- Go to any course/program page
- Click on "AI Coach" tab
- You should see the chat interface with "Ask your LearnGPT about..." header

## Feature Tests

### Test 1: Send a Message to Real AI API
**Steps:**
1. Type a message: "What are the basics of React?"
2. Click send button or press Enter
3. Watch for typing indicator (bouncing dots)

**Expected Results:**
- User message appears in blue bubble on right
- Typing indicator shows for 2-10 seconds
- AI response appears in gray bubble on left
- Response includes natural language answer

**What's Happening:**
- Frontend sends request to: `http://10.10.7.82:8008/api/v1/chat/`
- With payload: `{ message: "What are...", skill_level: "beginner", session_id: "uuid-..." }`
- Receives response with: `{ response: "...", sources: [...], metadata: {...} }`

---

### Test 2: Verify Sources Display
**Steps:**
1. Send a message
2. Wait for AI response
3. Look below the AI message

**Expected Results:**
- If API returns sources, gray box appears with "📚 Sources:"
- Each source shows:
  - Module name
  - Relevance percentage (0-100%)
  - Content preview (max 2 lines)
- Example:
  ```
  📚 Sources:
  React Fundamentals (Relevance: 92%)
  React is a JavaScript library for building user interfaces...
  
  Advanced React Patterns (Relevance: 78%)
  Common patterns and best practices for React development...
  ```

**If Not Showing:**
- API might not be returning sources in response
- Check browser console (F12 > Console tab) for errors
- Check api.service.js - sendMessageToExternalAI method

---

### Test 3: Verify Metadata Display
**Steps:**
1. Send a message
2. Wait for AI response
3. Look for small gray text below sources

**Expected Results:**
- Shows line with:
  - Model: gpt-4 (or model name)
  - Response: 234ms (or response time)
  - Tokens: 145 (or token count)
- Example: `Model: gpt-4 Response: 234ms Tokens: 145`

**If Not Showing:**
- API might not be returning metadata
- Check response structure from AI endpoint
- Metadata fields: model_used, response_time_ms, tokens_used

---

### Test 4: Verify Credit System (3 Free Messages)
**Steps:**
1. Send message #1: "Hello"
   - Should send successfully
   - Header shows: "Remaining 2/3"
   
2. Send message #2: "How are you?"
   - Should send successfully
   - Header shows: "Remaining 1/3"
   - Toast notification: "You have 0 free messages remaining"
   
3. Send message #3: "Tell me about JavaScript"
   - Should send successfully
   - Header shows: "Remaining 0/3"
   
4. Try to send message #4
   - Red error toast: "You've used all your free messages. Please upgrade to continue."
   - Pricing modal appears (if showPricingModal is implemented)
   - Message does NOT get sent to API

**What This Tests:**
- ✅ Credit counter working
- ✅ API only called if credits > 0
- ✅ Toast notifications for credit warnings
- ✅ Modal shown when limit reached

**If Messages Send After 3:**
- Check freeCredits state in GuidedDashboard.jsx
- Verify `if (freeCredits <= 0 && !isSubscribed)` condition
- Check that setFreeCredits() is being called after each response

---

### Test 5: Verify Session ID Persistence
**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Send a message
4. Check Network tab > XHR/Fetch requests

**Expected Results:**
- Request to `http://10.10.7.82:8008/api/v1/chat/` shows up
- Request body includes `session_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
- All messages in same session share same session_id
- Close tab and reopen = new session_id

**How to Verify in Console:**
```javascript
// In browser console, you can see the session_id
// It's generated on component mount with uuidv4()
```

---

### Test 6: Verify Typing Indicator
**Steps:**
1. Send a message
2. Immediately watch the chat area

**Expected Results:**
- Before AI response appears, see 3 animated dots
- Dots bounce up and down continuously
- Animation disappears when actual response arrives

**CSS Used:**
- `animate-bounce` class from TailwindCSS
- Staggered delays: 0s, 0.1s, 0.2s

---

### Test 7: Error Handling
**Steps 1 - Network Error:**
1. Turn off internet or block API in DevTools
2. Send a message
3. Wait for timeout

**Expected Results:**
- Typing indicator shows
- After timeout: Red toast error: "Failed to get AI response"
- Error message appears in chat: "Sorry, I encountered an error: ..."
- Credit NOT deducted

**Steps 2 - Invalid Input:**
1. Try to send empty message (just spaces)
2. Click send

**Expected Results:**
- Nothing happens (early return in handleSendMessage)
- No API call made
- No error shown

**Steps 3 - Invalid Skill Level:**
1. Change skillLevel to invalid value (e.g., "ninja")
2. Send message

**Expected Results:**
- API might reject or default to "beginner"
- Should still get response (or error from API)
- Error displayed gracefully

---

## Debugging Guide

### Check Browser Console (F12 > Console)
Look for any errors like:
```
Error sending message to external AI: Error: Network Error
Uncaught TypeError: sources is not defined
```

### Check Network Tab (F12 > Network)
1. Filter by XHR or Fetch
2. Look for requests to `10.10.7.82:8008`
3. Click request to see:
   - **Request Headers:** Auth, Content-Type
   - **Request Body:** message, skill_level, session_id
   - **Response:** response, sources, metadata
4. Check Status Code: 200 = success, 4xx = client error, 5xx = server error

### Check React State (F12 > Components)
1. Install React DevTools extension
2. Select GuidedDashboard component
3. Check state values:
   - freeCredits: Should be 3, 2, 1, 0
   - sessionId: Should be UUID like "12345678-..."
   - isAiResponding: Should be true while loading, false after response
   - conversations: Should have objects with {sender, text, sources?, metadata?}

### Common Issues

| Issue | Solution |
|-------|----------|
| Typing indicator doesn't appear | Check `isAiResponding` state is being set to true |
| Sources not showing | Verify API returns `sources` array in response |
| Metadata not showing | Verify API returns `metadata` object in response |
| Message sends after credit limit | Check `freeCredits <= 0` condition in handleSendMessage |
| New session on each message | Verify sessionId is in useEffect with empty deps array |
| API 404 error | Check endpoint: `http://10.10.7.82:8008/api/v1/chat/` |
| CORS error | Backend needs to allow requests from frontend origin |
| Messages not displaying | Check message object structure: {sender, text, sources?, metadata?} |

---

## API Response Examples

### Successful Response
```json
{
  "response": "React is a JavaScript library for building user interfaces with reusable components.",
  "sources": [
    {
      "module": "React Fundamentals",
      "chunk_id": "chunk_001",
      "relevance": 0.95,
      "content_preview": "React is a declarative, efficient, and flexible JavaScript library..."
    },
    {
      "module": "JSX Syntax",
      "chunk_id": "chunk_042",
      "relevance": 0.78,
      "content_preview": "JSX allows you to write HTML-like syntax in your JavaScript code..."
    }
  ],
  "metadata": {
    "model_used": "gpt-4",
    "response_time_ms": 245,
    "tokens_used": 156,
    "skill_level": "beginner"
  },
  "follow_up_suggestions": [
    "What is component state?",
    "How do I use hooks?"
  ]
}
```

### Error Response
```json
{
  "error": "Invalid session ID",
  "message": "The provided session_id is not valid"
}
```

---

## Performance Benchmarks

### Expected Response Times
- First request: 500-2000ms (includes model loading)
- Subsequent requests: 200-800ms (model cached)
- Network latency: 10-50ms (depending on location)

### Expected Token Usage
- Short question: 50-100 tokens
- Long question: 100-300 tokens
- Long response: 200-500 tokens

### Credit System Timing
- 1st message: Immediate send
- 2nd message: Immediate send
- 3rd message: Immediate send
- 4th message: Toast error, no send

---

## Production Deployment Checklist

- [ ] Verify AI API endpoint is accessible
- [ ] Test with multiple concurrent users
- [ ] Monitor API response times
- [ ] Check error rates
- [ ] Verify credits system with real users
- [ ] Test session persistence
- [ ] Verify sources display with real data
- [ ] Check metadata accuracy
- [ ] Load test: 100+ concurrent requests
- [ ] Security: Verify session_id cannot be guessed
- [ ] Analytics: Track message counts and topics
- [ ] Fallback: What happens if AI API goes down?

---

## Support Contact

For integration issues:
- Check `/front-end/src/services/api.service.js` for externalAiClient setup
- Check `/front-end/src/Pages/Dashboard/GuidedDashboard.jsx` for UI logic
- Review browser console for specific error messages
- Check network tab for API response format

For API issues:
- Verify endpoint: `http://10.10.7.82:8008/api/v1/chat/`
- Verify request format: `{ message, skill_level, session_id }`
- Verify response includes: `{ response, sources, metadata }`
- Check API logs for server-side errors
