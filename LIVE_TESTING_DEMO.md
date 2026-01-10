# 🎬 LIVE TESTING DEMO - What You'll See

This document shows exactly what you'll see when testing the AI Chat integration.

---

## 🎯 Scenario: User Asks "What is a Sprint in Scrum?"

### Step 1: User Sends Message
```
┌─────────────────────────────────────────┐
│  What is a Sprint in Scrum?  [SEND →]  │
└─────────────────────────────────────────┘
```

**Console Shows:**
```javascript
📤 Sending message to AI API...
Session ID: 550e8400-e29b-41d4-a716-446655440000
Skill Level: beginner
Message: What is a Sprint in Scrum?
```

---

### Step 2: Immediate Feedback (< 100ms)

**UI Shows:**
```
User Message (Blue Bubble):
┌─────────────────────────────────────┐
│                           What is a │
│              Sprint in Scrum?        │
└─────────────────────────────────────┘

Input Field:
┌─────────────────────────────────────┐
│  [Empty & Ready for next message]    │
└─────────────────────────────────────┘

Free Credits:
"Remaining 2/3"
```

**Console Shows:**
```javascript
🔄 Calling external AI API...
Endpoint: http://10.10.7.82:8008/api/v1/chat/
Request payload: {
  message: "What is a Sprint in Scrum?",
  skill_level: "beginner",
  session_id: "550e8400-e29b-41d4-a716-446655440000",
  program_id: "scrum-master"
}
```

---

### Step 3: Waiting for Response (2-5 seconds)

**UI Shows:**
```
User Message (Blue Bubble):
┌─────────────────────────────────────┐
│                           What is a │
│              Sprint in Scrum?        │
└─────────────────────────────────────┘

Typing Indicator (Gray Bubble):
┌─────────────────────────────────────┐
│  • • •                              │
│  (bouncing animation)               │
└─────────────────────────────────────┘
```

**Console Shows:**
```javascript
(waiting... no new logs for 2-5 seconds)
```

---

### Step 4: Response Received ✅

**Console Shows:**
```javascript
✅ API Response received: {
  response: "A Sprint in Scrum is a short, fixed period of time...",
  sources: Array(3),
  metadata: {...}
}

📥 Response from AI API: {success: true, data: {...}}

✅ AI Response received: "A Sprint in Scrum is a short, fixed period of time—usually between 1 to 4 weeks—during which the Scrum team works to develop a product increment..."

Sources: (3) [{...}, {...}, {...}]

Metadata: {
  tokens_used: 718,
  response_time_ms: 3040,
  model_used: "gpt-4.1-mini",
  skill_level: "beginner"
}
```

---

### Step 5: Full Display

**UI Shows:**

#### AI Response (Gray Bubble)
```
┌─────────────────────────────────────────┐
│ A Sprint in Scrum is a short, fixed     │
│ period of time—usually between 1 to 4   │
│ weeks—during which the Scrum team works │
│ to develop a product increment...       │
│                                         │
│ Would you like to learn more about:     │
│ 1. Product Backlog...                   │
│ 2. The roles of Product Owner...        │
│ 3. The values that help...              │
└─────────────────────────────────────────┘
```

#### Sources Card
```
┌─────────────────────────────────────────┐
│ 📚 Sources:                              │
├─────────────────────────────────────────┤
│ ENG_Module1_Scrum.docx (Relevance: 71%) │
│ 📚 Complete Educational Source – Module │
│ 1: Introduction to Scrum                │
│                                         │
│ ENG_Module1_Scrum.docx (Relevance: 68%) │
│ 🧾 6. Scrum Glossary – Sprint: A 1- to │
│ 4-week iteration...                     │
│                                         │
│ ENG_Module1_Scrum.docx (Relevance: 63%) │
│ by Ken Schwaber and Jeff Sutherland...  │
└─────────────────────────────────────────┘
```

#### Metadata Card
```
┌─────────────────────────────────────────┐
│ Model: gpt-4.1-mini | Response: 3040ms  │
│ Tokens: 718                             │
└─────────────────────────────────────────┘
```

#### Credits Display
```
✨ Remaining: 2/3
   (3 free → 2 after first message)
```

#### Ready for Next Message
```
┌─────────────────────────────────────────┐
│  Ask another question...     [SEND →]   │
└─────────────────────────────────────────┘
```

---

## 🔍 Network Tab View

### POST Request
```
Name:    chat/
URL:     http://10.10.7.82:8008/api/v1/chat/
Method:  POST
Status:  200 ✅
Type:    xhr
Size:    2.5 KB
Time:    3041 ms
```

### Request Headers
```
POST /api/v1/chat/ HTTP/1.1
Host: 10.10.7.82:8008
Content-Type: application/json
Content-Length: 145
```

### Request Body
```json
{
  "message": "What is a Sprint in Scrum?",
  "skill_level": "beginner",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "program_id": "scrum-master"
}
```

### Response Status
```
HTTP/1.1 200 OK
```

### Response Body (Preview)
```json
{
  "response": "A Sprint in Scrum is...",
  "sources": [
    {
      "module": "ENG_Module1_Scrum.docx",
      "chunk_id": 0,
      "relevance": 0.716247022151947,
      "content_preview": "..."
    },
    ...
  ],
  "metadata": {
    "tokens_used": 718,
    "response_time_ms": 3040,
    "model_used": "gpt-4.1-mini"
  }
}
```

---

## 📊 Timeline

```
T+0ms   │ User clicks Send
T+50ms  │ ✅ Message appears in blue bubble
T+100ms │ ✅ Input clears, typing indicator shows
T+150ms │ 📤 Console: "Sending message..."
T+200ms │ 🔄 Console: "Calling external AI API..."
        │ Network: POST request sent
        │
T+2000- │ ⏳ Waiting for AI server...
T+5000ms│ 🔄 AI processing...
        │
T+5100ms│ ✅ Response received from server
T+5150ms│ ✅ Console: "API Response received"
T+5200ms│ ✅ Response parsed
T+5250ms│ 📥 Console: "Response from AI API"
T+5300ms│ ✅ AI message appears in gray bubble
T+5350ms│ ✅ Sources section renders
T+5400ms│ ✅ Metadata section renders
T+5450ms│ ✅ Credits updated (3→2)
T+5500ms│ ✅ Ready for next message
```

**Total time user waits:** ~5.5 seconds  
**Expected range:** 2-6 seconds

---

## 📱 Full Conversation Example

After sending 2 messages:

```
┌─────────────────────────────────────────┐
│           AI Coach - Guided              │
├─────────────────────────────────────────┤
│                                         │
│ Hi! How can I help you today? 😊       │
│ (Initial greeting)                      │
│                                         │
├─────────────────────────────────────────┤
│                    What is a Sprint?     │  ← User Message 1
│                                    [👤] │
├─────────────────────────────────────────┤
│ [🤖]                                    │
│ A Sprint in Scrum is a short, fixed     │  ← AI Response 1
│ period of time...                       │
│                                         │
│ 📚 Sources:                              │
│ ├─ ENG_Module1_Scrum.docx (71%)         │
│ ├─ ENG_Module1_Scrum.docx (68%)         │
│ └─ ENG_Module1_Scrum.docx (63%)         │
│                                         │
│ Model: gpt-4.1-mini | Time: 3040ms      │
├─────────────────────────────────────────┤
│        How do Sprints help delivery?     │  ← User Message 2
│                                    [👤] │
├─────────────────────────────────────────┤
│ [🤖]                                    │
│ Sprints help with product delivery...   │  ← AI Response 2
│                                         │
│ 📚 Sources:                              │
│ ├─ ENG_Module1_Scrum.docx (75%)         │
│ └─ (more sources...)                    │
│                                         │
│ Model: gpt-4.1-mini | Time: 2850ms      │
├─────────────────────────────────────────┤
│ ✨ Remaining: 1/3 (1 message left free) │
├─────────────────────────────────────────┤
│                                         │
│  Next question...          [SEND →]     │
│                                         │
└─────────────────────────────────────────┘
```

---

## ✅ Success Indicators Checklist

When you see ALL of these, the integration is working perfectly:

```
☑  Message appears in blue bubble immediately
☑  Console shows 📤 emoji log
☑  Typing indicator appears (3 bouncing dots)
☑  Console shows 🔄 emoji log
☑  Network tab shows POST request
☑  Network tab shows Status 200
☑  Wait 2-5 seconds for response
☑  Console shows ✅ emoji log
☑  AI response appears in gray bubble
☑  Sources section renders with module names
☑  Relevance percentages show (e.g., 71%)
☑  Content preview text shows
☑  Metadata shows (Model: gpt-4.1-mini)
☑  Response time shows (e.g., 3040ms)
☑  Tokens used shows (e.g., 718)
☑  Credits decrement (3 → 2 → 1 → 0)
☑  Fourth message shows pricing modal
☑  No red errors in console
```

**If all checked ✅ = Success!**

---

## ❌ What NOT to See

These would indicate a problem:

```
❌ No 📤 log in console
❌ No 🔄 log in console
❌ No ✅ log in console
❌ Red error message in console
❌ No POST request in Network tab
❌ POST request with status 404 or 500
❌ Message doesn't appear in blue bubble
❌ Typing indicator doesn't appear
❌ Response never appears (hangs forever)
❌ Sources don't display
❌ Metadata doesn't display
❌ Credits don't update
❌ No pricing modal on 4th message
```

**If any of these appear:** Check troubleshooting guide

---

## 🎯 Three Test Levels

### Level 1: Basic Test (2 minutes)
```
1. Open app at http://localhost:5174
2. Go to AI Coach
3. Send: "What is a Sprint?"
4. ✅ See response in chat
```

### Level 2: Detailed Test (5 minutes)
```
1. Do Level 1
2. Open F12 DevTools
3. Go to Console tab
4. ✅ See all emoji logs (📤 🔄 ✅)
5. ✅ See sources displayed
6. ✅ See metadata displayed
```

### Level 3: Full Validation (10 minutes)
```
1. Do Level 2
2. Open Network tab (F12 → Network)
3. ✅ See POST request
4. ✅ Verify request has all 4 parameters
5. ✅ Verify response status is 200
6. Send 3 more messages
7. ✅ See credits decrement
8. ✅ See pricing modal on 4th message
```

---

## 🚀 Ready to Test?

### Start Now:
```bash
# Terminal 1: Start dev server
cd /home/root_coder/Downloads/demo/backend/front-end
npm run dev

# Then in browser:
1. Open http://localhost:5174
2. Navigate to Dashboard → AI Coach
3. Press F12 (open DevTools)
4. Send a test message
5. Watch the magic happen! ✨
```

**You're about to see:**
1. Your message appear instantly (blue)
2. Typing indicator animating
3. AI response arrive in 2-5 seconds (gray)
4. Sources with relevance scores
5. Metadata with metrics
6. Everything working smoothly!

---

**The AI Coach is ready to talk! 🎉**

**Test it now and let me know what you see!**
