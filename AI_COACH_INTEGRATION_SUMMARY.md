# AI Coach Backend Integration - Summary

## Overview
Successfully integrated the AI Coach feature with the backend guided questions system. The AI Coach now displays questions and answers from the admin dashboard's guided questions configuration.

## Changes Made

### 1. **AiCoachTab.jsx** (`/front-end/src/Pages/Overview/AiCoachTab.jsx`)
**Purpose:** Connect the course ID to the GuidedDashboard component

**Changes:**
- Added `useParams()` hook to extract the program ID from the URL (`/overview/:id/ai-coach`)
- Passed `programId={id}` prop to `GuidedDashboard` component when "Guided Learning Path" mode is selected
- Updated imports to include `useParams` from `react-router-dom`

```jsx
const { id } = useParams();
<GuidedDashboard tab={true} embedded={true} programId={id} />
```

### 2. **GuidedDashboard.jsx** (`/front-end/src/Pages/Dashboard/GuidedDashboard.jsx`)
**Purpose:** Fetch and display guided questions from the backend

**Changes:**

#### A. Added Backend Integration
- Imported `programAPI` from services to fetch program data
- Added `programId` as a component prop
- Added state to store fetched program data: `const [program, setProgram] = useState(null)`
- Added `loading` state for data fetching status

#### B. Fetch Program Data with Guided Questions
```javascript
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

#### C. Updated Message Handling Logic
Modified `handleSendMessage()` to:
- Search for matching guided questions in the program data
- Find the corresponding answer from the backend
- Display the answer as an AI response with a slight delay (800ms) for chatbot effect
- Fallback message if no match found

```javascript
const handleSendMessage = () => {
  if (inputValue.trim()) {
    // Add user message to conversation
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

    // Simulate typing effect with delay
    setTimeout(() => {
      setConversations((prev) => [
        ...prev,
        {
          sender: "ai",
          text: answer,
        },
      ]);
    }, 800);
  }
};
```

#### D. Updated Sidebar Questions Display
Replaced hardcoded guided questions with dynamic data from backend:
- Displays the actual course name instead of hardcoded categories
- Shows actual guided questions from `program.guidedQuestions.questions`
- Implements free attempt limiting (first N questions are free, rest are locked)
- User can click a question to auto-populate it in the chat input

```jsx
{program && program.guidedQuestions?.enabled ? (
  <div className="p-2 rounded-lg bg-[#00518F]/80">
    {/* Display course name as dropdown header */}
    <span>{program.name}</span>
    
    {/* List all guided questions */}
    {program.guidedQuestions.questions.map((q, qIdx) => (
      <div
        onClick={() => {
          if (isLocked) {
            setShowPricingModal(true);
          } else {
            setInputValue(q.question);  // Auto-fill question
            setSidebarOpen(false);
          }
        }}
      >
        <span>{q.question}</span>
        {isLocked && <Lock className="w-4 h-4 text-gray" />}
      </div>
    ))}
  </div>
) : (
  <div className="text-gray-400 text-sm p-2">
    No guided questions available for this course
  </div>
)}
```

#### E. Removed Hardcoded Data
- Removed hardcoded `guided` array (hardcoded course names)
- Removed hardcoded `guidedQuestions` array (multiple preset questions)
- All questions now come from the backend program configuration

## How It Works

### User Flow:
1. User navigates to `/overview/:programId/ai-coach`
2. User selects skill level and chooses "Guided Learning Path"
3. GuidedDashboard component receives `programId`
4. Component fetches program data including guided questions from backend
5. Sidebar displays questions from the program's guided questions
6. User can either:
   - Click a question in the sidebar to auto-fill it
   - Type their own question
7. System searches for matching question in guided questions
8. If found, displays the corresponding answer as AI response
9. Answer appears with 800ms delay for chatbot effect
10. Questions are free until limit reached (configurable via `freeAttempts`)

### Backend Data Structure:
The integration expects the following structure from the program API:

```javascript
{
  success: true,
  data: {
    _id: "...",
    name: "Course Name",
    guidedQuestions: {
      enabled: true,
      freeAttempts: 3,
      questions: [
        {
          question: "What is...",
          answer: "The answer is..."
        },
        {
          question: "How to...",
          answer: "Here's how..."
        }
      ]
    },
    // ... other program properties
  }
}
```

## Features Implemented

✅ **Dynamic Question Loading** - Questions load from backend admin dashboard configuration
✅ **Chatbot-like Interface** - Answers appear with delay for natural interaction
✅ **Question Matching** - Partial matching of user input with stored questions
✅ **Auto-fill from Sidebar** - Click question in sidebar to populate chat input
✅ **Free Attempt Limiting** - Control how many questions are free vs paid
✅ **Responsive Sidebar** - Sidebar collapses on mobile, expandable
✅ **Fallback Message** - Graceful handling when question not found
✅ **Pricing Modal** - Shows when user tries to access locked questions

## Testing Checklist

- [ ] Navigate to `/overview/{courseId}/ai-coach`
- [ ] Select skill level and "Guided Learning Path" mode
- [ ] Verify guided questions appear in sidebar with course name
- [ ] Click a question in sidebar - should populate in chat input
- [ ] Type a question matching a guided question - should show correct answer
- [ ] Verify answers appear with typing delay effect
- [ ] Test free attempt limiting (check pricing modal shows)
- [ ] Test fallback message for unmatched questions
- [ ] Test on mobile - sidebar should be collapsible
- [ ] Verify loading state while fetching program data

## Admin Dashboard Integration

In the admin dashboard when creating/editing a course:
1. Go to "Guided Questions" section
2. Enable "Guided Questions"
3. Set number of free attempts
4. Add questions and their corresponding answers
5. Save the course

These questions will now automatically appear in the AI Coach for students taking that course.

## Notes

- The system uses case-insensitive partial matching to find questions
- Matching checks both if user input contains question text and vice versa
- The 800ms delay simulates AI processing time
- Free attempt limit can be configured per course
- Locked questions show a lock icon and trigger pricing modal
