# AI Coach Integration - Visual Quick Reference

## 🔄 Complete User Journey

```
╔═══════════════════════════════════════════════════════════════╗
║                    STUDENT JOURNEY                           ║
╚═══════════════════════════════════════════════════════════════╝

1️⃣  NAVIGATE TO AI COACH
   URL: http://localhost:5173/overview/{courseId}/ai-coach
   └─► Component extracts courseId from URL

2️⃣  SELECT SKILL LEVEL
   ┌─ Beginner
   ├─ Intermediate
   └─ Advance
   └─► Move to next step

3️⃣  CHOOSE MODE
   ┌─ Guided Learning Path ◄─── SELECT THIS
   └─ Other options...
   └─► GuidedDashboard loads

4️⃣  COMPONENT INITIALIZATION
   ┌─ programId passed to GuidedDashboard
   ├─ API Call: GET /programs/{courseId}
   ├─ Response contains guided questions
   └─ Sidebar populates with questions

5️⃣  SIDEBAR DISPLAYS QUESTIONS
   ┌─────────────────────────────────┐
   │ Guided Questions                │
   │                                 │
   │ ▼ Immigration Course Name       │
   │  ├─ Q1: What is immigration?    │
   │  ├─ Q2: How to prepare for...   │
   │  ├─ Q3: What documents are...   │
   │  ├─ Q4: How to apply? 🔒        │
   │  └─ Q5: What to expect? 🔒      │
   │                                 │
   │ (Free: First 3 | Lock icon      │
   │  means needs subscription)       │
   └─────────────────────────────────┘

6️⃣  INTERACT WITH QUESTIONS
   
   Option A: Click Sidebar Question
   ┌─────────────────────────┐
   │ Click: "What is...?" │
   │         ↓              │
   │ Message auto-fills    │
   │ in chat input         │
   │         ↓              │
   │ Press Send button     │
   └─────────────────────────┘
   
   Option B: Type Custom Question
   ┌─────────────────────────┐
   │ Type: "Tell me about..." │
   │         ↓                │
   │ System searches for       │
   │ matching question         │
   │         ↓                │
   │ Press Send button        │
   └─────────────────────────┘

7️⃣  SYSTEM PROCESSES MESSAGE
   ┌──────────────────────────┐
   │ Search in Database:      │
   │                          │
   │ guidedQuestions.map()    │
   │         ↓                │
   │ Find matching Q/A pair   │
   │         ↓                │
   │ If Found: return answer  │
   │ If Not: return default   │
   └──────────────────────────┘

8️⃣  CHATBOT RESPONSE EFFECT
   User: "What is immigration?"
   ────────────────────────────
   ✨ Wait 800ms (simulates thinking)
   ✨ Show response in chat
   
   AI: "Immigration is the process..."

9️⃣  CHAT CONTINUES
   Message 1: Question ✓
   Message 2: Question ✓
   Message 3: Question ✓
   Message 4: ⚠️ LIMIT REACHED!
   
   └─► Pricing Modal Shows
       "Unlock more questions"

🔟 PRICING MODAL
   ┌──────────────────────────┐
   │ Choose Your Plan:        │
   │                          │
   │ □ Exam Simulator: $19.99 │
   │ ✓ Full Access: $29.99    │
   │ □ AI Coach Only: $19.99  │
   │                          │
   │ [Choose Plan] [Later]    │
   └──────────────────────────┘
   
   └─► Subscribe → Chat limit resets
       Skip → Continue with free limit
```

---

## 🏗️ Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Overview Page                              │
│         /overview/{courseId}/ai-coach                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────▼──────────────┐
          │   AiCoachTab.jsx         │
          │                          │
          │ - Extract courseId       │
          │ - Manage skill level     │
          │ - Show mode selector     │
          └───────────┬──────────────┘
                      │
          ┌───────────▼──────────────────┐
          │  GuidedDashboard.jsx        │
          │  (NEW: accepts programId)   │
          │                             │
          │ - Fetch program data        │
          │ - Display questions         │
          │ - Handle chat messages      │
          │ - Match Q&A from backend    │
          │ - Show pricing modal        │
          └───────────┬─────────────────┘
                      │
          ┌───────────▼──────────────┐
          │  api.service.js          │
          │                          │
          │  programAPI.getById()    │
          └───────────┬──────────────┘
                      │
          ┌───────────▼──────────────┐
          │  Backend API             │
          │  GET /programs/{id}      │
          └───────────┬──────────────┘
                      │
          ┌───────────▼──────────────┐
          │  Database                │
          │  Program + Questions     │
          └──────────────────────────┘
```

---

## 💾 Data Structure

```javascript
Program Document (MongoDB/Database):
{
  _id: "607f1f77bcf86cd799439011",
  name: "Immigration & Language Prep",
  category: "Immigration",
  description: "Learn about...",
  coverImage: "path/to/image.jpg",
  
  // ← NEW: Guided Questions Structure
  guidedQuestions: {
    enabled: true,
    freeAttempts: 3,           // First 3 free
    questions: [
      {
        question: "What is immigration?",
        answer: "Immigration is the process of moving to another country..."
      },
      {
        question: "How to prepare for IELTS?",
        answer: "Start by understanding the test format, practice reading..."
      },
      {
        question: "What documents needed?",
        answer: "Required documents include: Passport, Birth certificate..."
      },
      {
        question: "How to apply?",
        answer: "Submit your application through the official portal..."
      }
    ]
  },
  
  // Other fields...
  quizzes: [],
  examSimulator: { ... },
  documentation: { ... },
  createdAt: "2024-01-10T...",
  updatedAt: "2024-01-10T..."
}
```

---

## 🔄 Message Flow

### Scenario: User Asks "How to apply?"

```
STEP 1: User Input
┌─────────────────────────────┐
│ Chat Input Area             │
│ ┌───────────────────────┐   │
│ │ How to apply?         │   │
│ └───────────────────────┘   │
│ [Send Button Click]         │
└─────────────────────────────┘
           │
           ▼
STEP 2: Add User Message to Chat
conversations = [
  { sender: "ai", text: "Hi! How can I help..." },
  { sender: "user", text: "How to apply?" }
]
           │
           ▼
STEP 3: Search for Match
userMessage = "How to apply?"
program.guidedQuestions.questions.find(q => 
  q.question.toLowerCase().includes("how to apply?") ||
  "how to apply?".toLowerCase().includes(q.question)
)
           │
           ├─ Match Found! ✓
           │  matchedQuestion = {
           │    question: "How to apply?",
           │    answer: "Submit your application through..."
           │  }
           │
           ▼
STEP 4: Wait 800ms (Chatbot Effect)
setTimeout(() => {
  // Show answer after delay
}, 800)
           │
           ▼
STEP 5: Add AI Response
conversations = [
  { sender: "ai", text: "Hi! How can I help..." },
  { sender: "user", text: "How to apply?" },
  { sender: "ai", text: "Submit your application through..." }
]
           │
           ▼
STEP 6: Update Chat Display
┌─────────────────────────────┐
│      Chat History           │
│                             │
│ AI: Hi! How can I help...   │
│     😊                      │
│                             │
│ You: How to apply?          │
│                             │
│ AI: Submit your             │
│     application through...  │
└─────────────────────────────┘
```

---

## 🎯 State Management

```javascript
// Component State in GuidedDashboard

State Variables:
├─ program: null → {...program data}
├─ loading: true → false
├─ conversations: [{...}]
├─ inputValue: ""
├─ chatCount: 0
├─ dropdownIndex: null
├─ isSubscribed: false
├─ showPricingModal: false
└─ sidebarOpen: false

Effects:
├─ useEffect(() => fetchProgram(), [programId])
└─ useEffect(() => handleResize(), [])

Event Handlers:
├─ handleSendMessage() → Search & respond
├─ handleInputChange() → Update inputValue
├─ handleMaybeLater() → Hide pricing modal
└─ onClick handlers → Sidebar interactions

Computed Values:
├─ sidebarWidth → "w-72" or "w-16"
├─ activeTab → index calculation
└─ isLocked → Based on chatCount & freeAttempts
```

---

## ✅ Question Matching Logic

```javascript
// EXACT MATCHING ALGORITHM

Search Input: "How to apply?"
Database Questions:
  1. "What is immigration?"
  2. "How to prepare for IELTS?"
  3. "What documents needed?"
  4. "How to apply?"
  5. "Where to submit?"

Process:
┌────────────────────────────────────────┐
│ For Each Question in Database:         │
│                                        │
│ Q1: "What is immigration?"             │
│     ├─ Includes "How to apply?"? NO    │
│     └─ Is in "How to apply?"? NO       │
│     → Continue to next                 │
│                                        │
│ Q2: "How to prepare for IELTS?"        │
│     ├─ Includes "How to apply?"? NO    │
│     └─ Is in "How to apply?"? NO       │
│     → Continue to next                 │
│                                        │
│ Q3: "What documents needed?"           │
│     ├─ Includes "How to apply?"? NO    │
│     └─ Is in "How to apply?"? NO       │
│     → Continue to next                 │
│                                        │
│ Q4: "How to apply?"                    │
│     ├─ Includes "How to apply?"? YES ✓ │
│     └─► MATCH FOUND! Return answer     │
└────────────────────────────────────────┘

Result: Answer = "Submit your application..."
```

---

## 🔐 Free Attempt Logic

```javascript
freeAttempts = 3

Question Index  |  Is Locked?  |  User Can Access?
─────────────────────────────────────────────────
      0         |     NO       |      ✓ Free
      1         |     NO       |      ✓ Free
      2         |     NO       |      ✓ Free
      3         |     YES      |      ✗ Needs Subscription
      4         |     YES      |      ✗ Needs Subscription
      5         |     YES      |      ✗ Needs Subscription

Logic:
isLocked = (questionIndex > 1) 
           AND (user not subscribed) 
           AND (questionIndex >= freeAttempts)

After 3 free messages:
chatCount = 3
Next message attempt → showPricingModal = true
```

---

## 📱 Responsive Layout

```
DESKTOP (> 768px)
┌──────────────────────────────────────────┐
│ Header                                   │
├──────────┬──────────────────────────────┤
│ Sidebar  │  Chat Area                   │
│ (270px)  │                              │
│          │  ┌────────────────────────┐  │
│ Questions│  │ AI: Hi! How can I...   │  │
│ ·        │  │                        │  │
│ · Click │  │ You: Tell me about...  │  │
│ · them  │  │                        │  │
│ · auto  │  │ AI: Immigration is...  │  │
│ · fill  │  │                        │  │
│          │  └────────────────────────┘  │
│          │  ┌────────────────────────┐  │
│          │  │ [Type message...] Send │  │
│          │  └────────────────────────┘  │
└──────────┴──────────────────────────────┘

MOBILE (< 768px)
┌──────────────────────────┐
│ Header                   │
├──────────────────────────┤
│ [☰] Sidebar (collapsed)  │
├──────────────────────────┤
│  Chat Area               │
│                          │
│  AI: Hi! How can I...    │
│                          │
│  You: Tell me...         │
│                          │
│  AI: Immigration is...   │
├──────────────────────────┤
│ [Type message...] Send   │
└──────────────────────────┘

[☰] Click to expand sidebar
```

---

## 🔌 API Integration Points

```
1️⃣ INITIAL LOAD
   GuidedDashboard mounts
        ↓
   useEffect triggered
        ↓
   if (programId) {
     programAPI.getById(programId)
        ↓
     GET /api/programs/{programId}
        ↓
     Response: { success, data: { ...program, guidedQuestions } }
        ↓
     setProgram(data)
   }

2️⃣ USER SENDS MESSAGE
   handleSendMessage()
        ↓
   Search in program.guidedQuestions.questions[]
        ↓
   Find matching question
        ↓
   Extract answer
        ↓
   Add to conversations state
        ↓
   Display in UI (no API call)

3️⃣ PRICING (Future)
   handleChoosePlan()
        ↓
   POST /api/subscriptions (if implemented)
        ↓
   Subscribe user
        ↓
   Reset chat limit
```

---

## 🚦 Component Lifecycle

```
MOUNT
  ↓
useEffect (programId dependency)
  ↓
  setLoading(true)
  ↓
  API Call: programAPI.getById(programId)
  ↓
  setLoading(false)
  setProgram(data)
  ↓
RENDER with program data
  ↓
USER INTERACTS (type/click)
  ↓
  handleSendMessage()
  OR
  sidebar click
  ↓
UPDATE state
  ↓
RE-RENDER with new messages
  ↓
REPEAT until unmount
  ↓
UNMOUNT (cleanup)
```

---

## 🎓 Key Concepts

```
Concept         | What It Does
────────────────────────────────────────────
programId       | Unique course identifier from URL
programAPI      | Service to fetch program data
guided          | Questions to show in sidebar
questions       | Array of { question, answer }
matching        | Finding user input in database
freeAttempts    | How many questions before paywall
chatCount       | Number of messages sent (limit)
conversations   | Array of { sender, text } objects
isLocked        | Whether question needs subscription
showPricingModal| Display upgrade options
sidebarOpen     | Sidebar visible on mobile
loading         | Fetching data status
```

---

## ⚡ Performance Optimization Ideas

```
Current:
  - Single API call on mount
  - Linear search O(n) for questions
  - 800ms fixed delay

Could Add:
  - Cache program data in localStorage
  - Debounce search input
  - Memoize question array
  - Use Web Workers for search
  - Implement virtual scrolling
  - Add loading skeleton UI
  - Lazy load answers
  - Implement question indexing
```

---

## 📊 Example Data In Database

```javascript
db.programs.findOne({_id: ObjectId("...")})

{
  _id: ObjectId("605e8e2b2e5a1b0012abc123"),
  name: "Immigration & Language Preparation",
  topic: "Immigration",
  category: "Language & Immigration",
  difficulty: "Beginner",
  
  guidedQuestions: {
    enabled: true,
    freeAttempts: 3,
    questions: [
      {
        question: "What is immigration?",
        answer: "Immigration is a complex process involving legal procedures to move to another country for permanent residence or citizenship."
      },
      {
        question: "How to prepare for IELTS?",
        answer: "Practice daily for at least 2 hours, take mock tests, join study groups, and focus on weak areas. Use official IELTS materials."
      },
      {
        question: "What documents are needed?",
        answer: "Required documents typically include: Valid passport, birth certificate, educational certificates, police clearance, and medical records."
      },
      {
        question: "How to apply for visa?",
        answer: "Visit official government website, create account, fill application form, upload documents, pay fee, and attend interview if called."
      }
    ]
  }
}
```

That's everything! 🎉
