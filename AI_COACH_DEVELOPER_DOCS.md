# AI Coach Integration - Developer Documentation

## Overview
This document provides detailed technical information about the AI Coach backend integration for developers.

## Files Modified

### 1. `/front-end/src/Pages/Overview/AiCoachTab.jsx`

**Line Changes:**
- Line 4: Added `useParams` to imports
- Line 8: Added `const { id } = useParams();` 
- Line 45: Changed to `<GuidedDashboard tab={true} embedded={true} programId={id} />`

**Code Diff:**
```jsx
// BEFORE
import { useLocation } from "react-router-dom";
...
<GuidedDashboard tab={true} embedded={true} />

// AFTER
import { useLocation, useParams } from "react-router-dom";
...
const { id } = useParams();
...
<GuidedDashboard tab={true} embedded={true} programId={id} />
```

**Why:** To extract the course ID from URL and pass it to child component for API calls.

---

### 2. `/front-end/src/Pages/Dashboard/GuidedDashboard.jsx`

**Major Changes:**

#### A. Imports (Lines 1-23)
**Added:**
```javascript
import { programAPI } from "../../services/api.service";
```

**Removed:**
```javascript
import toast from "react-hot-toast";  // Now unused
```

#### B. Component Props (Line 25)
**Before:**
```javascript
const GuidedDashboard = ({ tab, embedded }) => {
```

**After:**
```javascript
const GuidedDashboard = ({ tab, embedded, programId }) => {
```

#### C. State Variables (Lines 26-43)
**Added:**
```javascript
const [program, setProgram] = useState(null);
// eslint-disable-next-line no-unused-vars
const [loading, setLoading] = useState(true);
```

**Removed (Cleanup):**
```javascript
const [showSearch, setShowSearch] = useState(false);
const [searchValue, setSearchValue] = useState("");
const [editTitle, setEditTitle] = useState("");
```

These were unused in the original code and causing linter warnings.

#### D. New UseEffect Hook (Lines 91-111)
**Complete Addition:**
```javascript
// Fetch program data with guided questions
useEffect(() => {
  const fetchProgram = async () => {
    if (!programId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await programAPI.getById(programId);
      if (response.success) {
        setProgram(response.data);
      }
    } catch (error) {
      console.error("Error fetching program:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProgram();
}, [programId]);
```

**Purpose:** Fetches program data including guided questions when component mounts or programId changes.

**Dependency Array:** `[programId]` - Re-fetches if programId changes.

**Error Handling:** Catches and logs errors to console; component still renders with no program state.

#### E. Modified handleSendMessage Function (Lines 130-176)
**Before:**
```javascript
const handleSendMessage = () => {
  if (inputValue.trim()) {
    if (chatCount >= 3) {
      setShowPricingModal(true);
      setChatCount((prev) => prev + 1);
      return;
    }
    setConversations((prev) => [
      ...prev,
      { sender: "user", text: inputValue },
      {
        sender: "ai",
        text: "This is a static AI response. I'm here to help with your learning!",
      },
    ]);
    setInputValue("");
    setChatCount((prev) => prev + 1);
  }
};
```

**After:**
```javascript
const handleSendMessage = () => {
  if (inputValue.trim()) {
    if (chatCount >= 3) {
      setShowPricingModal(true);
      setChatCount((prev) => prev + 1);
      return;
    }

    // Add user message to conversation
    const userMessage = inputValue;
    setConversations((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    // Find matching answer from guided questions
    let answer = "I don't have an answer for that question yet.";
    if (
      program?.guidedQuestions?.enabled &&
      program?.guidedQuestions?.questions?.length > 0
    ) {
      const matchedQuestion = program.guidedQuestions.questions.find(
        (q) =>
          q.question.toLowerCase().includes(userMessage.toLowerCase()) ||
          userMessage.toLowerCase().includes(q.question.toLowerCase())
      );
      if (matchedQuestion) {
        answer = matchedQuestion.answer;
      }
    }

    // Simulate typing effect by adding response after a short delay
    setTimeout(() => {
      setConversations((prev) => [
        ...prev,
        {
          sender: "ai",
          text: answer,
        },
      ]);
    }, 800);

    setInputValue("");
    setChatCount((prev) => prev + 1);
  }
};
```

**Key Changes:**
1. Store user message in variable before clearing input
2. Initialize default answer message
3. Check if guided questions are enabled
4. Find matching question using case-insensitive partial matching
5. Add response with 800ms delay (not instantly)

**Logic Flow:**
```
User sends message
    ↓
Check chat limit (3 messages)
    ↓
Add user message to conversation
    ↓
Search program.guidedQuestions.questions for match
    ↓
If found: use q.answer
If not found: use default message
    ↓
Wait 800ms
    ↓
Add AI response to conversation
    ↓
Clear input & increment chat count
```

#### F. Updated Sidebar Questions Section (Lines 418-475)

**Before:**
```javascript
{guided.map((item, idx) => (
  <div key={item.id} className="p-2 rounded-lg bg-[#00518F]/80">
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={() =>
        setDropdownIndex(dropdownIndex === idx ? null : idx)
      }
    >
      <span>{item.id}. {item.name}</span>
      <ChevronDown ... />
    </div>
    {dropdownIndex === idx && (
      <div className="mt-2 bg-white rounded-lg shadow-lg text-black ">
        {guidedQuestions[idx].map((q, qIdx) => {
          const isLocked = qIdx > 1;
          return (
            // Question item with hardcoded lock logic
          );
        })}
      </div>
    )}
  </div>
))}
```

**After:**
```javascript
{program && program.guidedQuestions?.enabled ? (
  <div className="p-2 rounded-lg bg-[#00518F]/80">
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={() =>
        setDropdownIndex(dropdownIndex === 0 ? null : 0)
      }
    >
      <span>{program.name}</span>
      <ChevronDown ... />
    </div>
    {dropdownIndex === 0 && (
      <div className="mt-2 bg-white rounded-lg shadow-lg text-black">
        {program.guidedQuestions.questions.length > 0 ? (
          program.guidedQuestions.questions.map((q, qIdx) => {
            const isLocked =
              qIdx > 1 &&
              !isSubscribed &&
              qIdx >= (program.guidedQuestions?.freeAttempts || 3);
            return (
              <React.Fragment key={qIdx}>
                <div
                  className={`px-3 py-2 flex items-center justify-between text-sm ${
                    isLocked
                      ? "bg-gray-100 text-gray cursor-pointer"
                      : "hover:bg-blue-100 cursor-pointer text-gray-900"
                  }`}
                  onClick={() => {
                    if (isLocked) {
                      setShowPricingModal(true);
                    } else {
                      setInputValue(q.question);
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <span>{q.question}</span>
                  {isLocked && (
                    <Lock className="w-4 h-4 text-gray" />
                  )}
                </div>
                {qIdx <
                  program.guidedQuestions.questions.length - 1 && (
                  <div className="border-t border-gray-200 mx-2"></div>
                )}
              </React.Fragment>
            );
          })
        ) : (
          <div className="px-3 py-2 text-sm text-gray-500">
            No questions available
          </div>
        )}
      </div>
    )}
  </div>
) : (
  <div className="text-gray-400 text-sm p-2">
    No guided questions available for this course
  </div>
)}
```

**Changes:**
1. Dynamic dropdown based on `program` existence
2. Use `program.name` instead of hardcoded category names
3. Loop through `program.guidedQuestions.questions` instead of static array
4. Extract `q.question` directly (not just `q`)
5. Smart locking: `qIdx >= (program.guidedQuestions?.freeAttempts || 3)`
6. Click to fill: `setInputValue(q.question)` auto-populates chat
7. Error states for no program or no questions

#### G. Removed Hardcoded Data
**Lines Removed (~60 lines):**
```javascript
// REMOVED: Hardcoded guided array
const guided = [
  { id: 1, name: "Immigration & Language Preparation" },
  { id: 2, name: "Project Management" },
  { id: 3, name: "Tech & Development" },
];

// REMOVED: Hardcoded guidedQuestions array
const guidedQuestions = [
  [
    "What are the main steps for immigration?",
    "How to prepare for IELTS/TOEFL?",
    // ... 9 questions total
  ],
  // ... 2 more arrays of 9 questions each
];
```

These were replaced with dynamic data from backend.

#### H. Code Cleanup
**Removed unused variables:**
- `showSearch`, `setShowSearch`
- `searchValue`, `setSearchValue`
- `editTitle`, `setEditTitle`
- `sidebarPosition` (calculated but never used)
- `toast` import (never used)

**Kept but marked as unused:**
- `handleChoosePlan` (added eslint-disable-next-line comment - for future use)

---

## API Expectations

### Endpoint Called
```
GET /programs/{programId}
```

### Response Format Expected
```javascript
{
  success: true,
  data: {
    _id: "65a7d8c9e1c2b3a4f5g6h7i8",
    name: "Immigration & Language Preparation",
    topic: "Immigration",
    description: "...",
    coverImage: "...",
    guidedQuestions: {
      enabled: true,
      freeAttempts: 3,
      questions: [
        {
          question: "What are the main steps for immigration?",
          answer: "The main steps are: 1) Assess eligibility, 2) Prepare documents..."
        },
        {
          question: "How to prepare for IELTS/TOEFL?",
          answer: "Start with understanding test format, practice daily..."
        },
        // ... more questions
      ]
    },
    // ... other program properties
  }
}
```

### Error Handling
If API fails or programId is missing:
- Error is logged to console
- `program` state remains `null`
- Component displays "No guided questions available for this course"
- No crash occurs

---

## State Management Flow

```javascript
// Initial State
program: null
loading: true
inputValue: ""
conversations: [{ sender: "ai", text: "Hi! How can I help you today? 😊" }]
chatCount: 0
dropdownIndex: null
// ... other states

// After programId received
useEffect → fetchProgram()
  → loading = true
  → API call
  → loading = false
  → program = { name: "...", guidedQuestions: { ... } }

// When user types
inputValue = "What is immigration?"

// When user sends message
handleSendMessage()
  → Search program.guidedQuestions.questions
  → Find match or use default
  → setTimeout(800ms)
  → Add AI response
  → Clear inputValue
  → Increment chatCount

// At limit (chatCount >= 3)
→ Show pricing modal
→ Block further free messages
```

---

## Question Matching Logic

### Algorithm
```javascript
const matchedQuestion = program.guidedQuestions.questions.find(
  (q) =>
    q.question.toLowerCase().includes(userMessage.toLowerCase()) ||
    userMessage.toLowerCase().includes(q.question.toLowerCase())
);
```

### How It Works
1. Convert both strings to lowercase
2. Check if database question contains user input
3. OR check if user input contains database question
4. First match is returned (find() stops at first match)

### Examples

**Example 1: Exact Match**
- User: "What are the main steps for immigration?"
- Database: "What are the main steps for immigration?"
- Lowercase User: "what are the main steps for immigration?"
- Lowercase DB: "what are the main steps for immigration?"
- Result: ✅ Perfect match (condition 1 and 2 true)

**Example 2: Partial - User contains DB**
- User: "Tell me about What are the main steps for immigration?"
- Database: "What are the main steps for immigration?"
- Condition 1: DB.includes(User) → FALSE
- Condition 2: User.includes(DB) → TRUE
- Result: ✅ Match found (OR condition true)

**Example 3: Partial - DB contains User**
- User: "main steps"
- Database: "What are the main steps for immigration?"
- Condition 1: DB.includes(User) → TRUE
- Result: ✅ Match found

**Example 4: No Match**
- User: "Tell me about cooking"
- Database: No question contains "cooking"
- Result: ❌ No match, show default message

---

## Performance Considerations

### Current Implementation
- API call on mount/programId change (standard)
- Matching is O(n) where n = number of questions (acceptable)
- 800ms delay is hardcoded (could be configurable)

### Potential Optimizations
1. **Cache program data** in localStorage/Context
2. **Memoize program.guidedQuestions.questions** for faster re-renders
3. **Use fuzzy matching** library for better matching
4. **Batch questions** if > 100 questions
5. **Lazy load answers** only when needed
6. **Implement virtual scrolling** for large question lists

### Current Bottlenecks
- First API call on component mount
- String matching for every question
- No pagination for large question sets

---

## Testing Strategy

### Unit Tests to Add
```javascript
describe('GuidedDashboard', () => {
  test('should fetch program data on mount', async () => {
    // Mock programAPI.getById
    // Verify setProgram called with correct data
  });

  test('should find matching question', () => {
    // Test question matching logic
    // Various input combinations
  });

  test('should show default message for no match', () => {
    // User input doesn't match any question
    // Verify default message shown
  });

  test('should handle locked questions', () => {
    // User reaches chat limit
    // Verify pricing modal shows
  });

  test('should handle missing programId', () => {
    // programId not provided
    // Verify no API call, no crash
  });
});
```

### Integration Tests
```javascript
// Full flow test
1. Mount component with programId
2. Wait for API call
3. Verify sidebar shows questions
4. Click question
5. Verify message sent
6. Verify answer appears
7. Repeat until limit
8. Verify modal shows
```

---

## Debugging Tips

### Check Console Logs
```javascript
// Add to handleSendMessage for debugging
console.log('User Message:', userMessage);
console.log('Program:', program);
console.log('Questions:', program?.guidedQuestions?.questions);
console.log('Matched Question:', matchedQuestion);
console.log('Answer:', answer);
```

### Check Network Tab
- Look for GET `/programs/{programId}`
- Verify response includes `guidedQuestions`
- Check for 404 or 500 errors

### Check Component State
In React DevTools:
- `program` should contain full program object
- `conversations` should have alternating user/ai messages
- `chatCount` should increment

### Common Issues & Solutions

**Issue: Program is null**
- Check if programId is being passed
- Check if API endpoint is correct
- Check if CORS is configured

**Issue: Questions not matching**
- Check exact question text in database
- Try lowercase version
- Check for extra spaces/punctuation

**Issue: Sidebar empty**
- Verify `guidedQuestions.enabled` is true
- Check `questions` array has items
- Check `program` is not null

---

## Future Improvements

### Phase 2: Enhanced Matching
```javascript
// Use Levenshtein distance or Jaro-Winkler similarity
// Better for typos and variations
const similarity = calculateSimilarity(userMessage, q.question);
if (similarity > 0.8) matchFound = true;
```

### Phase 3: AI Integration
```javascript
// For unmached questions, call real AI API
if (!matchedQuestion) {
  const aiAnswer = await openAI.createCompletion(userMessage);
  answer = aiAnswer.text;
}
```

### Phase 4: Context Awareness
```javascript
// Remember conversation context
const conversationContext = conversations.slice(-5); // Last 5 messages
// Use context to refine next answer
```

### Phase 5: Analytics
```javascript
// Track questions asked
analytics.trackQuestion({
  courseId,
  question: userMessage,
  answered: !!matchedQuestion,
  timestamp: Date.now()
});
```

