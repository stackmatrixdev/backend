# 🎯 AI Integration - Visual Quick Reference

## Request Format
```json
POST http://10.10.7.82:8008/api/v1/chat/

{
  "message": "User's question",
  "program_id": "scrum-master",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "skill_level": "beginner"
}
```

## Response Format
```json
{
  "response": "AI's answer...",
  "sources": [
    {
      "module": "ENG_Module1_Scrum.docx",
      "chunk_id": 0,
      "relevance": 0.716,
      "content_preview": "..."
    }
  ],
  "metadata": {
    "tokens_used": 718,
    "response_time_ms": 3040,
    "model_used": "gpt-4.1-mini"
  }
}
```

---

## Console Log Sequence

```
1. 📤 Sending message to AI API...
2. Session ID: [UUID]
3. Skill Level: beginner
4. Message: [user message]
5. 🔄 Calling external AI API...
6. Endpoint: http://10.10.7.82:8008/api/v1/chat/
7. Request payload: {...}
8. ✅ API Response received: {...}
9. 📥 Response from AI API: {...}
10. ✅ AI Response received: [response text]
11. Sources: [Array]
12. Metadata: {tokens_used: 718, ...}
```

---

## UI Display Flow

```
┌──────────────────────────────┐
│ User types message           │
│ Clicks Send                  │
└──────────────────┬───────────┘
                   ▼
┌──────────────────────────────┐
│ User message appears         │
│ (blue bubble - immediate)    │
└──────────────────┬───────────┘
                   ▼
┌──────────────────────────────┐
│ Typing indicator appears     │
│ (3 bouncing dots)            │
└──────────────────┬───────────┘
                   ▼
┌──────────────────────────────┐
│ API call made                │
│ (takes 2-5 seconds)          │
└──────────────────┬───────────┘
                   ▼
┌──────────────────────────────┐
│ Typing indicator disappears  │
│ AI response appears          │
│ (gray bubble)                │
└──────────────────┬───────────┘
                   ▼
┌──────────────────────────────┐
│ Sources card displays        │
│ Metadata card displays       │
│ Credits decrement            │
└──────────────────────────────┘
```

---

## Quick Troubleshooting

| Problem | Check | Fix |
|---------|-------|-----|
| No logs | Console open? | Press F12 before sending |
| Session ID null | Page loaded? | Refresh (F5) |
| No API request | Network tab | Check if message sent |
| API error 404 | Endpoint correct? | Check URL in code |
| No response | Server running? | Verify AI server up |
| CORS error | Headers set? | Contact API admin |

---

## Test Checklist (5 min)

- [ ] App running at http://localhost:5174
- [ ] DevTools open (F12)
- [ ] Go to AI Coach page
- [ ] Send message "What is a Sprint?"
- [ ] See 📤 in console
- [ ] See 🔄 in console
- [ ] See ✅ in console
- [ ] See AI response in chat
- [ ] See sources displayed
- [ ] See metadata displayed

✅ If all checked → **SUCCESS!**

---

## Key Files

| File | Change | Impact |
|------|--------|--------|
| api.service.js | Added programId param | Request now complete |
| GuidedDashboard.jsx | Passing programId | Sends correct data |

---

## Metrics to Monitor

| Metric | Target | Max |
|--------|--------|-----|
| Message send | Instant | 100ms |
| API response | 2-5 sec | 30 sec |
| Total time | 2-6 sec | 35 sec |

---

## States That Matter

```javascript
sessionId        // UUID v4 generated on mount
skillLevel       // "beginner" (can be dynamic)
programId        // From component props
freeCredits      // 3 → 2 → 1 → 0 (then modal)
isAiResponding   // true (shows typing) → false
conversations    // Array of messages
```

---

## Error Messages to Expect

| Message | Meaning | Solution |
|---------|---------|----------|
| "Session ID not initialized" | sessionId is null | Refresh page |
| "Network Error" | Can't reach API | Check server |
| "CORS policy" | Browser blocking | Contact admin |
| "500 Internal Server" | API error | Check API logs |

---

## Success Indicators

✅ **Console:** 📤 🔄 ✅ (all present)  
✅ **Network:** POST status 200  
✅ **UI:** Response + Sources + Metadata  
✅ **Credits:** 3 → 2 → 1 → 0  
✅ **No errors:** Console clean  

---

## API Endpoint Details

```
URL: http://10.10.7.82:8008/api/v1/chat/
METHOD: POST
HEADERS: Content-Type: application/json
TIMEOUT: 30 seconds
EXPECTED_STATUS: 200
EXPECTED_RESPONSE: {response, sources, metadata}
```

---

## Testing Links

📖 Full Guide: `AI_API_INTEGRATION_TESTING.md`  
✅ Checklist: `TESTING_CHECKLIST.md`  
📊 Flow Diagram: `AI_COMPLETE_FLOW.md`  
🚀 Quick Start: `AI_QUICK_START.md`  
📋 Status: `AI_STATUS_REPORT.md`  

---

## Start Testing Now!

```bash
1. Open: http://localhost:5174
2. Go to: Dashboard → AI Coach
3. Press: F12 (DevTools)
4. Send: Test message
5. Watch: Console logs
6. Verify: Sources + Metadata
```

**That's it! You're testing!** 🎉
