# ✅ AI COACH STRUCTURE CLARIFICATION - CORRECTED UNDERSTANDING

## 🎯 The Correct Architecture

You are absolutely right. The AI Coach has TWO completely different sections:

### Section 1: "Guided Learning Path" (FAKE AI CHAT - Pre-made Q&A)
- **Source:** Pre-made questions and answers from Admin Dashboard
- **Flow:** User clicks a question → Answer displays as if from AI bot
- **Data:** Questions and answers already declared/stored
- **API:** NO API CALL - Data is already in the system
- **Purpose:** Guided learning with predetermined content

### Section 2: "Free Questions" (REAL AI CHAT - Dynamic Q&A)
- **Source:** User types any question they want
- **Flow:** User types question → Call real AI API → Get response → Display in chat
- **Data:** From http://10.10.7.82:8008/api/v1/chat/
- **API:** YES - Must call external AI API
- **Limit:** 3 free messages, then requires subscription
- **Purpose:** Free access to real AI answers with credit limit

---

## 📋 Skill Level Implementation

### Step 1: Skill Level Selector (At the Top of AI Coach)
```
┌─────────────────────────────────────┐
│  Skill Level: [Beginner ▼]          │  ← User selects here
│  [Beginner] [Intermediate] [Advanced]│
└─────────────────────────────────────┘
```

### Storage Location
The selected skill level should be:
```javascript
const [skillLevel, setSkillLevel] = useState("beginner");
// or
const [selectedSkillLevel, setSelectedSkillLevel] = useState("beginner");
```

This variable is then used ONLY in the "Free Questions" section when calling the API.

---

## 🏗️ Complete Structure (Corrected)

```
AI COACH PAGE
│
├─ 1️⃣ SKILL LEVEL SELECTOR (At Top)
│  └─ Dropdown: [Beginner] [Intermediate] [Advanced]
│  └─ Stored in: skillLevel variable
│
├─ 2️⃣ TWO TABS / SECTIONS
│  │
│  ├─ TAB A: "Guided Learning Path" (FAKE AI CHAT)
│  │  ├─ Source: Admin-created questions (predefined)
│  │  ├─ Display: List of questions user can click
│  │  ├─ On Click: Show answer as bot response
│  │  ├─ Data: Already stored in system
│  │  ├─ No API: Uses static/stored data only
│  │  └─ Flow:
│  │     └─ User clicks "What is Scrum?" 
│  │        → Show: "Scrum is a framework..."
│  │        (from pre-made answer)
│  │
│  └─ TAB B: "Free Questions" (REAL AI CHAT)
│     ├─ Source: User types custom questions
│     ├─ Display: Chat interface with input box
│     ├─ On Submit: Call real AI API
│     ├─ Data: From http://10.10.7.82:8008/api/v1/chat/
│     ├─ Uses API: YES - External AI service
│     ├─ Credit System:
│     │  ├─ Free: 3 messages
│     │  ├─ Limit Check: Before API call
│     │  ├─ Decrement: After successful response
│     │  └─ Block: Show pricing modal when 0
│     └─ Flow:
│        ├─ User types custom question
│        ├─ Clicks Send
│        ├─ Check: freeCredits > 0?
│        ├─ Call: API with message + skillLevel
│        ├─ Show: Typing indicator
│        ├─ Receive: Response from AI
│        ├─ Display: In chat with sources/metadata
│        ├─ Decrement: freeCredits by 1
│        └─ Repeat until credits = 0
```

---

## 🔧 Implementation Details

### Skill Level Variable
```javascript
// At top of component
const [skillLevel, setSkillLevel] = useState("beginner");

// Skill level selector (dropdown/buttons)
const handleSkillLevelChange = (level) => {
  setSkillLevel(level);
  // This changes for both sections if needed
  // But mainly used in "Free Questions"
};

// Skill levels
const skillLevels = ["beginner", "intermediate", "advanced"];
```

### Guided Learning Path (Fake AI Chat)
```javascript
// This is static data - either fetched once or hardcoded
const [guidedQuestions, setGuidedQuestions] = useState([
  {
    id: 1,
    question: "What is Scrum?",
    answer: "Scrum is an agile framework..."
  },
  {
    id: 2,
    question: "What is a Sprint?",
    answer: "A Sprint is a 1-4 week iteration..."
  },
  // More predefined questions
]);

// Handle clicking a guided question
const handleGuidedQuestionClick = (question) => {
  // Add question to chat
  setConversations(prev => [...prev, 
    { sender: "user", text: question.question }
  ]);
  
  // Immediately add answer (no API call)
  setConversations(prev => [...prev, 
    { sender: "ai", text: question.answer }
  ]);
};
```

### Free Questions (Real AI Chat with API)
```javascript
const [freeCredits, setFreeCredits] = useState(3);
const [sessionId, setSessionId] = useState(null);

// Handle sending free question (calls API)
const handleSendFreeQuestion = async () => {
  // Step 1: Check credits
  if (freeCredits <= 0) {
    toast.error("No free questions remaining. Please upgrade.");
    setShowPricingModal(true);
    return;
  }
  
  // Step 2: Add user message to chat
  setConversations(prev => [...prev,
    { sender: "user", text: inputValue }
  ]);
  
  // Step 3: Show typing indicator
  setIsAiResponding(true);
  
  // Step 4: Call API with skillLevel
  try {
    const response = await aiChatAPI.sendMessageToExternalAI(
      inputValue,           // The question user typed
      skillLevel,           // "beginner" | "intermediate" | "advanced"
      sessionId,            // UUID session
      programId             // Program context
    );
    
    // Step 5: Display response
    if (response.success) {
      setConversations(prev => [...prev, {
        sender: "ai",
        text: response.data.response,
        sources: response.data.sources,
        metadata: response.data.metadata
      }]);
      
      // Step 6: Decrement credits
      setFreeCredits(prev => prev - 1);
      
      // Step 7: Check if more credits
      if (freeCredits - 1 <= 0) {
        toast.error("You've used all free questions!");
      }
    }
  } catch (error) {
    // Error handling
    toast.error("Failed to get response");
  }
  
  // Step 8: Clear input and hide typing
  setInputValue("");
  setIsAiResponding(false);
};
```

---

## 📊 Where Skill Level Is Used

### ✅ Used In: "Free Questions" Tab ONLY
```javascript
// API call in Free Questions
await aiChatAPI.sendMessageToExternalAI(
  message,
  skillLevel,      // ← USED HERE (beginner/intermediate/advanced)
  sessionId,
  programId
);
```

### ❌ NOT Used In: "Guided Learning Path"
```javascript
// Guided questions use pre-made answers
const answer = guidedQuestion.answer;  // Static/predetermined
// skillLevel is ignored here
```

---

## 🎯 Two Distinct Flows

### Flow 1: Guided Learning Path (Fake Chat)
```
Skill Level Selected: "Intermediate"
         ↓
User sees list of pre-made questions
"What is Scrum?" "What is Sprint?" etc.
         ↓
User clicks "What is Scrum?"
         ↓
Add to chat: User message "What is Scrum?"
Add to chat: AI message (pre-made answer)
         ↓
No API call, no credits used
Repeat for other questions
```

### Flow 2: Free Questions (Real Chat)
```
Skill Level Selected: "Intermediate"
         ↓
User sees chat interface
User types custom question: "How do I create a sprint?"
         ↓
Check: freeCredits > 0? YES (have 3)
         ↓
Call API: message + skill_level + session_id + program_id
         ↓
Get response from real AI API
         ↓
Display response in chat
         ↓
Decrement credits: 3 → 2
         ↓
Show: "Remaining 2/3"
         ↓
User can ask 2 more questions
After 3rd question: Decrement to 0 → Show pricing modal
```

---

## 💾 Storage & Data Sources

### Guided Questions (Predefined)
```
Source: Admin Dashboard
↓
Stored: Database or local state
↓
When Page Loads: Fetch from backend
↓
Display: List of clickable questions
↓
On Click: Show from memory (no API)
```

### Free Questions (Dynamic)
```
Source: User types anything
↓
Stored: Nowhere (temporary in state)
↓
When Submitted: Call external AI API
↓
Response: From http://10.10.7.82:8008/api/v1/chat/
↓
Display: Show in chat
↓
Track: Decrement freeCredits in state
```

---

## 🔑 Key Variables Needed

```javascript
// Skill Level (at top of component)
const [skillLevel, setSkillLevel] = useState("beginner");

// Guided Questions (static list from admin)
const [guidedQuestions, setGuidedQuestions] = useState([]);

// Free Questions (real API)
const [conversations, setConversations] = useState([]);
const [freeCredits, setFreeCredits] = useState(3);
const [inputValue, setInputValue] = useState("");

// UI State
const [currentTab, setCurrentTab] = useState("guided"); // or "free"
const [isAiResponding, setIsAiResponding] = useState(false);

// Session
const [sessionId, setSessionId] = useState(null);
```

---

## 📝 Request Format (Only for Free Questions Tab)

```json
POST http://10.10.7.82:8008/api/v1/chat/

{
  "message": "How do I create a sprint?",
  "program_id": "scrum-master",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "skill_level": "intermediate"  ← Selected at top
}
```

---

## ✅ Corrected Implementation Checklist

- [ ] Add skill level selector (3 options: beginner, intermediate, advanced)
- [ ] Store selected skill level in `skillLevel` variable
- [ ] Create "Guided Learning Path" tab (displays pre-made Q&A)
- [ ] Create "Free Questions" tab (chat interface)
- [ ] Fetch guided questions from admin dashboard
- [ ] Display guided questions as clickable list
- [ ] Handle guided question clicks (no API call)
- [ ] Show chat interface in Free Questions tab
- [ ] Implement free question handler with API calls
- [ ] Pass skillLevel to API call in Free Questions only
- [ ] Implement credit limit (3 free)
- [ ] Check credits before API call
- [ ] Decrement credits after successful response
- [ ] Show pricing modal when credits = 0
- [ ] Display API responses with sources and metadata

---

## 🎓 Summary

| Feature | Guided Learning | Free Questions |
|---------|-----------------|-----------------|
| **Source** | Admin Dashboard | User Input |
| **Data** | Pre-made Q&A | Real AI API |
| **Skill Level** | Not used | Used in API call |
| **API Call** | No | Yes |
| **Credit Cost** | 0 | 1 per question |
| **Limit** | None | 3 free |
| **Purpose** | Guided learning | Flexible answers |

---

**This is the correct understanding. Now let's build it right!** ✅
