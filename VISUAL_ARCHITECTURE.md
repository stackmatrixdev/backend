# 📊 VISUAL ARCHITECTURE - AI COACH CORRECTED

## 🎯 User Interface Layout

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    ★ SKILL LEVEL SELECTOR ★                 │
│   Skill Level: [Beginner ▼]    Credit Display: 3/3         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│    [📚 GUIDED LEARNING PATH]  [💬 FREE QUESTIONS]           │
│                  ↓                      ↓                    │
│            (Select this tab)      (Select this tab)         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  TAB 1: GUIDED LEARNING PATH           TAB 2: FREE QUESTIONS│
│                                                              │
│  Question List:                        Chat Area:           │
│  ┌──────────────────────┐              ┌──────────────────┐ │
│  │ 1. What is Scrum?    │              │ User: How do I..│ │
│  │ 2. What is Sprint?   │              │ AI: Here's how..│ │
│  │ 3. Scrum Roles?      │              │ User: Thank you │ │
│  │ 4. Daily Standup?    │              │ AI: You're welco│ │
│  │ 5. Sprint Review?    │              │                  │ │
│  └──────────────────────┘              └──────────────────┘ │
│                                        Input: [________]    │
│  Click a question ↓                    [Send Button]        │
│  Answer appears immediately            Credit: 1 left      │
│  (NO API CALL)                         (Decrements on send) │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Comparison

### GUIDED LEARNING PATH (Tab 1)
```
Admin Dashboard
     ↓
Store Q&A in Database
     ↓
Component Loads → Fetch Questions & Answers
     ↓
Display as List
     ↓
User Clicks Question
     ↓
Show Pre-made Answer
     ↓
Chat Display
     ↓
NO API CALL ✓
NO CREDITS USED ✓
INSTANT DISPLAY ✓
```

### FREE QUESTIONS (Tab 2)
```
User Types Question
     ↓
Clicks Send Button
     ↓
Check: Credits > 0?
     ├─ NO → Show "Upgrade Now"
     └─ YES → Continue
        ↓
Collect: message + skillLevel + sessionId + programId
     ↓
Call Real AI API
POST http://10.10.7.82:8008/api/v1/chat/
     ↓
Wait 2-5 seconds
     ↓
Get Response with sources + metadata
     ↓
Display in Chat
     ↓
Decrement Credit: 3 → 2 → 1 → 0
     ↓
If 0 → Show Pricing Modal
```

---

## 🎯 Skill Level Usage Map

```
┌─────────────────────┐
│  SKILL LEVEL        │
│  SELECTOR (Top)     │
│                     │
│ [Beginner ▼]        │
│ [Intermediate]      │
│ [Advanced]          │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ↓           ↓
 GUIDED TAB    FREE TAB
 (Ignored)    (USED HERE!)
              ↓
        API Request
        {
          message: "...",
          skill_level: value,  ← This!
          session_id: "...",
          program_id: "..."
        }
```

---

## 📊 State Variables Map

```
Component State
│
├─ skillLevel: "beginner" ← Top selector, used in FREE tab API
│
├─ activeTab: "guided" ← Which tab showing (guided | free)
│
├─ conversations: [] ← Chat messages (both tabs)
│  ├─ { sender: "user", text: "..." }
│  └─ { sender: "ai", text: "...", sources: [], metadata: {} }
│
├─ chatCount: 0 ← Tracks API calls in FREE tab (for 3 credit limit)
│
├─ inputValue: "" ← Text in input box
│
├─ isAiResponding: false ← Shows typing indicator
│
└─ sessionId: "UUID" ← Session for API calls
```

---

## 🔑 Handler Functions Map

```
GUIDED TAB HANDLER:
┌─────────────────────────────────────────┐
│ handleGuidedQuestionClick(question)     │
├─────────────────────────────────────────┤
│ Input:  {question: "...", answer: "..."} │
│ Action: Add message → Add response      │
│ API:    NO                               │
│ Credit: NO                               │
│ Time:   INSTANT                          │
└─────────────────────────────────────────┘

FREE TAB HANDLER:
┌─────────────────────────────────────────┐
│ handleSendFreeQuestion()                │
├─────────────────────────────────────────┤
│ Input:  inputValue (user typed)         │
│ Action: Check credits → Call API        │
│ API:    YES (with skillLevel)           │
│ Credit: YES (decrement on success)      │
│ Time:   2-5 seconds                      │
└─────────────────────────────────────────┘
```

---

## 📲 Click Flow Diagram

### GUIDED TAB
```
User sees "Guided Learning Path" tab
           ↓
      Click Tab
           ↓
   See list of questions
   "What is Scrum?"
   "What is Sprint?"
   etc.
           ↓
   User clicks "What is Scrum?"
           ↓
   handleGuidedQuestionClick(question) called
           ↓
   Add to chat: "What is Scrum?" (user bubble)
           ↓
   Add to chat: "Scrum is..." (bot bubble)
           ↓
   Display instantly (no waiting)
           ↓
   Credit counter: UNCHANGED (still 3/3)
           ↓
   User can click more questions (no limit)
```

### FREE TAB
```
User sees "Free Questions" tab
           ↓
      Click Tab
           ↓
   See chat interface with input
           ↓
   Can select Skill Level: [Intermediate ▼]
           ↓
   User types: "How do sprints help?"
           ↓
      Clicks Send
           ↓
   Check: chatCount < 3?
   ├─ NO (used 3) → Disable input + show "Upgrade"
   └─ YES → Continue
           ↓
   Show typing indicator (bouncing dots)
           ↓
   Call API:
   {
     message: "How do sprints help?",
     skill_level: "intermediate",  ← From skillLevel state
     session_id: "UUID",
     program_id: "scrum-master"
   }
           ↓
   Wait 2-5 seconds for response
           ↓
   Get: {response: "...", sources: [...], metadata: {...}}
           ↓
   Hide typing, show response in bot bubble
           ↓
   Increment: chatCount 0 → 1
   Display: Remaining 2/3
           ↓
   User can ask 2 more questions
   Then credit runs out → Show pricing modal
```

---

## 🎓 What Gets Displayed Where

### Guided Tab
```
┌──────────────────────────────────┐
│  GUIDED LEARNING PATH            │
├──────────────────────────────────┤
│                                  │
│  Questions (Clickable List):     │
│  • What is Scrum?                │
│  • What is Sprint?               │
│  • Scrum Roles                   │
│  • etc.                          │
│                                  │
│  Conversation (Below):           │
│  User: What is Sprint?           │
│  AI:   A Sprint is a short...    │
│  User: What is a standup?        │
│  AI:   A standup is a daily...   │
│                                  │
└──────────────────────────────────┘
```

### Free Tab
```
┌──────────────────────────────────┐
│  FREE QUESTIONS                  │
├──────────────────────────────────┤
│                                  │
│  Conversation:                   │
│  User: How do I create a sprint? │
│  AI:   First, you need to...     │
│        Sources: Module1, Module2 │
│        Model: gpt-4.1-mini       │
│        Response time: 3040ms      │
│                                  │
│  User: Can I change sprint length?
│  AI:   Yes, typically sprints     │
│        are 1-4 weeks...           │
│        Sources: ...               │
│                                  │
│  Input Area:                     │
│  [Type your question here]  [Send]│
│  Remaining: 1/3 credits           │
│                                  │
└──────────────────────────────────┘
```

---

## 💳 Credit System

### Where Credits Used
```
Guided Tab
  ├─ Question 1: Cost 0
  ├─ Question 2: Cost 0
  ├─ Question 3: Cost 0
  └─ Unlimited (no cost)

Free Tab
  ├─ Question 1: Cost 1 ← Credit 3 → 2
  ├─ Question 2: Cost 1 ← Credit 2 → 1
  ├─ Question 3: Cost 1 ← Credit 1 → 0
  └─ Question 4: BLOCKED (show "Upgrade")
```

### Credit Display
```
Header always shows:
"Remaining 3/3"  ← Initial state
"Remaining 2/3"  ← After 1st API call
"Remaining 1/3"  ← After 2nd API call
"Remaining 0/3"  ← After 3rd API call (show modal)
```

---

## 🎯 Request/Response Example

### API Request (Free Tab Only)
```
POST http://10.10.7.82:8008/api/v1/chat/

{
  "message": "How do I create a sprint?",
  "skill_level": "intermediate",        ← Selected at top
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "program_id": "scrum-master"
}
```

### API Response
```
{
  "response": "To create a sprint, first...",
  "sources": [
    {
      "module": "ENG_Module1_Scrum.docx",
      "chunk_id": 0,
      "relevance": 0.71,
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

## ✅ Implementation Checklist

### UI Elements
- [ ] Skill Level Selector (top, 3 options)
- [ ] Tab Buttons (Guided | Free)
- [ ] Guided Tab Content (question list)
- [ ] Free Tab Content (chat interface)
- [ ] Input Box (Free Tab only)
- [ ] Send Button (Free Tab only)
- [ ] Credit Counter (top right)

### Functionality
- [ ] Skill Level State + Change Handler
- [ ] Tab State + Change Handler
- [ ] Guided Question Handler (no API)
- [ ] Free Question Handler (with API)
- [ ] Credit Checking (before API call)
- [ ] Credit Decrement (after API call)
- [ ] Pricing Modal (when credits = 0)

### Data Flow
- [ ] Pass skillLevel to API call
- [ ] Handle API response (response + sources + metadata)
- [ ] Display in chat properly
- [ ] Track API call count
- [ ] Block when limit reached

---

## 🚀 Summary

**Two Completely Different Features:**

🎓 **Guided Learning Path**
- Pre-made Q&A from admin
- Click to see answer
- No API calls
- Unlimited questions
- Skill level: ignored

💬 **Free Questions**
- User types anything
- Real AI API response
- Limited to 3 free
- Skill level parameter sent to API
- Must upgrade after 3

**Both share the same chat interface but have completely different logic underneath!**

---

**Ready to implement?** You now have the complete vision! 🎉
