# Complete AI Chat Flow Diagram

## 🔄 Request/Response Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (React)                        │
├─────────────────────────────────────────────────────────────────┤
│ GuidedDashboard.jsx                                              │
│ ├─ State: inputValue, conversations, sessionId, skillLevel       │
│ ├─ handleSendMessage() triggered on message send                 │
│ └─ Calls: aiChatAPI.sendMessageToExternalAI(...)                │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API SERVICE LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│ api.service.js                                                   │
│ ├─ aiChatAPI.sendMessageToExternalAI()                           │
│ ├─ Parameters: message, skillLevel, sessionId, programId         │
│ ├─ Builds request object:                                        │
│ │  {                                                             │
│ │    message: "user question",                                   │
│ │    skill_level: "beginner",                                    │
│ │    session_id: "UUID-v4",                                      │
│ │    program_id: "scrum-master"                                  │
│ │  }                                                             │
│ └─ Logs: 🔄, request payload                                     │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              AXIOS HTTP CLIENT (externalAiClient)               │
├─────────────────────────────────────────────────────────────────┤
│ Method: POST                                                     │
│ URL: http://10.10.7.82:8008/api/v1/chat/                         │
│ Headers: Content-Type: application/json                          │
│ Body: {message, skill_level, session_id, program_id}            │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL AI SERVER                            │
├─────────────────────────────────────────────────────────────────┤
│ Endpoint: http://10.10.7.82:8008/api/v1/chat/                   │
│ Processes: message, queries knowledge base, generates response   │
│ Returns: {response, sources, metadata, follow_up_suggestions}   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSE HANDLING                             │
├─────────────────────────────────────────────────────────────────┤
│ api.service.js                                                   │
│ ├─ Logs: ✅ API response received                                │
│ ├─ Extracts: response.data                                       │
│ ├─ Returns: { success: true, data: response.data }               │
│ └─ On error: logs ❌ and error details                           │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT HANDLING                            │
├─────────────────────────────────────────────────────────────────┤
│ GuidedDashboard.jsx - handleSendMessage()                        │
│ ├─ if (result.success):                                          │
│ │  ├─ Extract: aiResponse, sources, metadata                     │
│ │  ├─ Logs: ✅ Response received, sources, metadata              │
│ │  ├─ Add to conversations state                                 │
│ │  ├─ Decrement freeCredits                                      │
│ │  └─ Show success toast                                         │
│ │                                                                 │
│ ├─ else (error):                                                 │
│ │  ├─ Logs: ❌ API Error                                         │
│ │  ├─ Add error message to conversations                         │
│ │  └─ Show error toast                                           │
│ │                                                                 │
│ └─ finally: setIsAiResponding(false)                            │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DISPLAY IN UI                                  │
├─────────────────────────────────────────────────────────────────┤
│ Render in GuidedDashboard.jsx                                    │
│ ├─ AI Response Text (gray bubble)                                │
│ ├─ Sources Card                                                  │
│ │  ├─ Module name                                                │
│ │  ├─ Relevance score (%)                                        │
│ │  └─ Content preview                                            │
│ ├─ Metadata Card                                                 │
│ │  ├─ Model used                                                 │
│ │  ├─ Response time (ms)                                         │
│ │  └─ Tokens used                                                │
│ └─ Free Credits: "Remaining X/3"                                │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Example

### Input
```
User types: "What is a Sprint in Scrum?"
User clicks: Send button
```

### Processing
```javascript
// Step 1: handleSendMessage() called
const userMessage = "What is a Sprint in Scrum?";
const skillLevel = "beginner";
const sessionId = "550e8400-e29b-41d4-a716-446655440000";
const programId = "scrum-master";

// Step 2: Call API
const result = await aiChatAPI.sendMessageToExternalAI(
  userMessage,
  skillLevel,
  sessionId,
  programId
);

// Step 3: API builds request
POST http://10.10.7.82:8008/api/v1/chat/
{
  "message": "What is a Sprint in Scrum?",
  "skill_level": "beginner",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "program_id": "scrum-master"
}

// Step 4: AI server processes and returns
{
  "response": "A Sprint in Scrum is a short, fixed period...",
  "sources": [
    {
      "module": "ENG_Module1_Scrum.docx",
      "chunk_id": 0,
      "relevance": 0.716,
      "content_preview": "📚 Complete Educational Source..."
    },
    { ... more sources ... }
  ],
  "metadata": {
    "tokens_used": 718,
    "response_time_ms": 3040,
    "model_used": "gpt-4.1-mini",
    "skill_level": "beginner"
  }
}

// Step 5: Component receives and displays
setConversations([
  ...,
  {
    sender: "ai",
    text: "A Sprint in Scrum is a short, fixed period...",
    sources: [...],
    metadata: {...}
  }
]);

// Step 6: UI renders
- AI message in gray bubble
- Sources section with 3 module references
- Metadata showing 718 tokens, 3040ms response time
```

## 🔍 Console Logs Breakdown

When a message is sent, you'll see these logs in order:

### Log 1: Message Sending
```javascript
console.log("📤 Sending message to AI API...");
console.log("Session ID:", sessionId);
console.log("Skill Level:", skillLevel);
console.log("Message:", userMessage);
```
**Indicates:** Message handler started, all values are ready

### Log 2: API Call Starting
```javascript
console.log("🔄 Calling external AI API...");
console.log("Endpoint: http://10.10.7.82:8008/api/v1/chat/");
console.log("Request payload:", {message, skill_level, session_id, program_id});
```
**Indicates:** About to make HTTP request, shows exact payload being sent

### Log 3: Response Success
```javascript
console.log("✅ API Response received:", response.data);
// Then in component:
console.log("📥 Response from AI API:", result);
console.log("✅ AI Response received:", aiResponse);
console.log("Sources:", sources);
console.log("Metadata:", metadata);
```
**Indicates:** Response received successfully, parsing complete

### Log 4: Error (if occurs)
```javascript
console.error("❌ Error sending message to external AI:", error);
console.error("Error message:", error.message);
console.error("Error response:", error.response);
console.error("Error config:", error.config);
```
**Indicates:** Network or API error occurred, details provided

## 🎯 State Management

### Initial State
```javascript
const [conversations, setConversations] = useState([
  { sender: "ai", text: "Hi! How can I help you today? 😊" }
]);
const [sessionId, setSessionId] = useState(null);
const [skillLevel, setSkillLevel] = useState("beginner");
const [freeCredits, setFreeCredits] = useState(3);
const [isAiResponding, setIsAiResponding] = useState(false);
```

### After User Sends Message
```javascript
// User message added immediately
conversations = [
  { sender: "ai", text: "Hi! How can..." },
  { sender: "user", text: "What is a Sprint?" }
];

// API responding
isAiResponding = true;  // Shows typing indicator

// After API response
conversations = [
  { sender: "ai", text: "Hi! How can..." },
  { sender: "user", text: "What is a Sprint?" },
  { 
    sender: "ai",
    text: "A Sprint in Scrum is...",
    sources: [...],
    metadata: {...}
  }
];
isAiResponding = false;  // Hides typing indicator
freeCredits = 2;  // Decremented by 1
```

## ⚡ Performance Metrics

| Metric | Typical | Max | Notes |
|--------|---------|-----|-------|
| Request build time | < 1ms | - | Instant |
| Network latency | 100-500ms | - | Varies by network |
| AI response time | 2-5s | 30s | See metadata.response_time_ms |
| Total time user sees | 2-6s | - | Request + AI processing + render |
| Console log count | 6-8 logs | - | Per successful request |

## 🐛 Common Issues & Logs

### Issue 1: Session ID Not Initialized
```
❌ Session ID is not initialized!
```
**Root Cause:** setSessionId() hasn't been called on mount  
**Fix:** Refresh page (F5)

### Issue 2: Network Error
```
❌ Error sending message to external AI: Network Error
Error message: Network Error
```
**Root Cause:** API server unreachable  
**Fix:** Check if http://10.10.7.82:8008 is accessible

### Issue 3: API Returns Error Status
```
❌ Error sending message to external AI: [object Object]
Error response: {status: 400, statusText: "Bad Request", data: {...}}
```
**Root Cause:** Wrong request format or API validation failed  
**Fix:** Verify request includes all 4 fields

### Issue 4: Request Hangs (No Response)
```
📤 Sending message...
...silence...
```
**Root Cause:** Request sent but no response after 30s  
**Fix:** Network timeout or API server slow/not responding  

## ✨ Summary

The complete flow ensures:
1. ✅ User input captured correctly
2. ✅ Session ID available before sending
3. ✅ Request formatted exactly as API expects
4. ✅ HTTP request made to correct endpoint
5. ✅ Response parsed and validated
6. ✅ Data displayed with sources and metadata
7. ✅ Credits system tracks usage
8. ✅ Errors logged for debugging
9. ✅ UX smooth with typing indicators and toasts

**All components working together = Seamless AI chat experience!**
