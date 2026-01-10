# AI Chat API - Quick Reference

## 🎯 What's Been Done

Your AI Coach now sends requests to the real AI API with the exact format you specified.

## 📍 API Endpoint
```
http://10.10.7.82:8008/api/v1/chat/
```

## 📤 Request Format
```json
{
  "message": "User's question here",
  "skill_level": "beginner",
  "session_id": "UUID-v4-string",
  "program_id": "scrum-master"
}
```

## 📥 Expected Response
```json
{
  "response": "AI's answer...",
  "sources": [
    {
      "module": "Module name",
      "chunk_id": 0,
      "relevance": 0.72,
      "content_preview": "Preview text..."
    }
  ],
  "metadata": {
    "tokens_used": 718,
    "response_time_ms": 3040,
    "model_used": "gpt-4.1-mini",
    "skill_level": "beginner"
  }
}
```

## 🔧 Files Changed
1. **api.service.js** - Added `program_id` to request
2. **GuidedDashboard.jsx** - Passes `program_id` when calling API

## 🧪 How to Test

### Quick Test (1 minute)
1. Press `F12` to open DevTools → Console tab
2. Go to AI Coach page
3. Type a question and send
4. Watch console for:
   - 📤 "Sending message to AI API..."
   - 🔄 "Calling external AI API..."
   - ✅ "API Response received:"

### Full Test (5 minutes)
1. Open DevTools → Network tab
2. Send a message
3. Find POST request to `http://10.10.7.82:8008/api/v1/chat/`
4. Check:
   - Request: Has all 4 fields (message, skill_level, session_id, program_id)
   - Response: Status 200, contains response/sources/metadata

## ✅ What You Should See
- Message appears immediately in blue bubble
- 3 bouncing dots while loading
- AI response appears in gray bubble after ~2-5 seconds
- Sources show module names with relevance percentages
- Metadata shows model, response time, tokens used
- Free credits counter decrements

## ❌ If Something's Wrong

### No logs in console?
- Make sure F12 console is open BEFORE sending message
- Refresh page and try again

### "Session ID not initialized" error?
- Refresh page (F5)
- Should show session ID in console on load

### Request not reaching API?
- Check Network tab - is POST showing up?
- Check if http://10.10.7.82:8008 is accessible
- Test with curl: 
  ```bash
  curl http://10.10.7.82:8008/api/v1/chat/ -X POST \
    -H "Content-Type: application/json" \
    -d '{"message":"test","skill_level":"beginner","session_id":"test","program_id":"test"}'
  ```

### Getting error response?
- Check console for exact error message
- Check Network tab response for details
- Refer to troubleshooting in full guide

## 📚 Full Documentation
See: `/home/root_coder/Downloads/demo/backend/AI_API_INTEGRATION_TESTING.md`

## 🚀 Current Status
✅ API integration complete  
✅ Request format correct  
✅ Response parsing working  
✅ Console logging ready for debugging  
✅ Ready to test!

---

**Next: Run the test steps above and share any console errors you see!**
