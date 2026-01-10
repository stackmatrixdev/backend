# AI Coach Integration - Visual Guide & Usage Instructions

## How to Use the AI Coach Feature

### For Admin (Setting up Guided Questions)

1. **Create/Edit a Course in Admin Dashboard**
   - Go to Admin Dashboard > Create Training/Edit Training
   - Scroll to "Guided Questions" section
   - Toggle "Enable Guided Questions" to ON

2. **Add Questions and Answers**
   ```
   Question Input: "What are the main steps for immigration?"
   Answer Input: "The main steps are 1) Assess eligibility, 2) Prepare documents, 3) Submit application, 4) Attend interview, 5) Wait for decision"
   
   Question Input: "How to prepare for IELTS?"
   Answer Input: "Preparation includes: Study test format, Practice reading, listening, writing, speaking, Take mock tests, Join coaching classes..."
   ```

3. **Set Free Attempts**
   - Set how many questions users can access for free (default: 3)
   - Additional questions require subscription

4. **Save the Course**
   - All questions will automatically sync with the AI Coach

### For Students (Using AI Coach)

#### **Step 1: Access the AI Coach**
```
Navigate to: http://localhost:5173/overview/{courseId}/ai-coach
```

#### **Step 2: Select Skill Level**
- Choose from: Beginner, Intermediate, Advance
- This helps personalize the experience

#### **Step 3: Choose Mode**
- Select "Guided Learning Path" to use questions from admin configuration
- Select other options for general chatbot

#### **Step 4: Interact with Questions**

**Option A - Using Sidebar Questions:**
```
1. Look at the left sidebar under "Guided Questions"
2. See the course name (e.g., "Immigration & Language Preparation")
3. Click to expand and see all available questions
4. Click any FREE question to auto-fill it in the chat
5. Press Send to get the answer
```

**Option B - Type Your Own Question:**
```
1. Type any question related to the course
2. System searches for matching question in database
3. If found → Shows the stored answer
4. If not found → Shows "I don't have an answer for that question yet"
5. Message appears with chatbot-like delay (800ms)
```

#### **Step 5: Hit Free Limit**
```
After using 3 free attempts (default):
- Next questions show lock icon 🔒
- Clicking shows pricing modal
- User can subscribe to unlock all questions
- OR continue asking questions within free limit
```

---

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Navigation                          │
│         /overview/{courseId}/ai-coach                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │     AiCoachTab.jsx           │
        │  - Extract course ID         │
        │  - Handle skill selection    │
        └──────────┬───────────────────┘
                   │
        ┌──────────▼───────────────────┐
        │   GuidedDashboard.jsx        │
        │  - Receive programId prop    │
        │  - Fetch program data        │
        └──────────┬───────────────────┘
                   │
        ┌──────────▼───────────────────┐
        │     API Service              │
        │  programAPI.getById(id)      │
        └──────────┬───────────────────┘
                   │
        ┌──────────▼───────────────────┐
        │    Backend API               │
        │  /programs/{id}              │
        └──────────┬───────────────────┘
                   │
        ┌──────────▼───────────────────┐
        │   Program Model              │
        │  - name                      │
        │  - guidedQuestions           │
        │    - enabled                 │
        │    - freeAttempts            │
        │    - questions[]             │
        │      - question              │
        │      - answer                │
        └──────────────────────────────┘


When User Asks Question:
┌──────────────────────────────────────┐
│   User Types or Clicks Question      │
└──────────────┬───────────────────────┘
               │
    ┌──────────▼─────────────────┐
    │ Search Guided Questions    │
    │ (Case-insensitive partial) │
    └──────────┬────────────────┘
               │
        ┌──────▼──────┬─────────────┐
        │             │             │
   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
   │  FOUND  │  │ NOT FOD │  │ LOCKED  │
   └────┬────┘  └────┬────┘  └────┬────┘
        │            │            │
        ▼            ▼            ▼
    Show Answer  Show Default  Show Pricing
    (800ms       Message       Modal
    delay)       
```

---

## File Changes Summary

### Modified Files:

1. **AiCoachTab.jsx**
   - Added: `useParams()` hook
   - Added: `programId={id}` prop to GuidedDashboard
   - Lines changed: ~10

2. **GuidedDashboard.jsx**
   - Added: `programAPI` import
   - Added: `programId` prop destructuring
   - Added: `program` and `loading` state
   - Added: useEffect to fetch program data
   - Modified: `handleSendMessage()` logic
   - Modified: Sidebar questions rendering
   - Removed: Hardcoded guided arrays
   - Lines changed: ~150

---

## Key Implementation Details

### 1. **Question Matching Algorithm**
```javascript
// Case-insensitive, partial string matching
const matchedQuestion = program.guidedQuestions.questions.find(
  (q) =>
    q.question.toLowerCase().includes(userMessage.toLowerCase()) ||
    userMessage.toLowerCase().includes(q.question.toLowerCase())
);
```

**Examples:**
- User asks: "What are the steps?" 
- Database: "What are the main steps for immigration?"
- Result: ✅ MATCH (contains match)

- User asks: "How to prepare for IELTS?"
- Database: "How to prepare for IELTS?"
- Result: ✅ MATCH (exact match)

- User asks: "Tell me about visa"
- Database: Contains no visa-related questions
- Result: ❌ NO MATCH

### 2. **Free Attempt Limiting**
```javascript
const isLocked = qIdx > 1 && !isSubscribed && qIdx >= (program.guidedQuestions?.freeAttempts || 3);
```

- If `freeAttempts = 3`: First 3 questions are free
- Questions 4+ show lock icon
- Clicking locked question shows pricing modal

### 3. **Chatbot Effect**
```javascript
setTimeout(() => {
  // Add AI response after 800ms delay
  setConversations((prev) => [...prev, { sender: "ai", text: answer }]);
}, 800);
```
- 800ms delay makes it feel like AI is "thinking"
- User sees typing indicator (can be enhanced)

---

## Testing Scenarios

### Scenario 1: Successful Question Match
```
Setup:
- Course has questions: ["What is immigration?"]
- Answer: "Immigration is the process of..."

Steps:
1. User clicks question or types "What is immigration?"
2. System finds exact match
3. 800ms delay
4. Answer appears in chat

Expected Result: ✅ Answer displays correctly
```

### Scenario 2: Partial Match
```
Setup:
- Course question: "What are the main steps for immigration?"
- User types: "main steps"

Expected Result: ✅ System finds match and shows answer
```

### Scenario 3: No Match
```
Setup:
- Course question: "What is immigration?"
- User types: "Tell me about cooking"

Expected Result: ✅ Shows "I don't have an answer for that question yet"
```

### Scenario 4: Free Attempt Limit
```
Setup:
- Course has freeAttempts: 2
- User has asked 2 questions (at limit)
- Third question should be locked

Expected Result: ✅ Lock icon shows, pricing modal appears on click
```

### Scenario 5: Mobile Responsive
```
Steps:
1. Open on mobile
2. Sidebar should collapse to icon
3. Click hamburger to expand
4. Questions should display correctly

Expected Result: ✅ Sidebar is fully functional and responsive
```

---

## Troubleshooting

### Issue: Questions Not Showing
**Solution:**
1. Check if `guidedQuestions.enabled` is true in admin dashboard
2. Verify questions were saved properly
3. Check browser console for API errors
4. Ensure `programId` is being passed correctly

### Issue: Answers Not Matching
**Solution:**
1. The matching is case-insensitive but partial
2. Check if question text is exactly in the database
3. Try asking differently - e.g., "How to prepare" instead of "Prepare"
4. Look at browser console to debug matching

### Issue: Sidebar Empty
**Solution:**
1. Verify program has guided questions configured
2. Check that `guidedQuestions.questions` array has items
3. Ensure network request to `/programs/{id}` succeeds
4. Clear browser cache and reload

### Issue: Pricing Modal Not Showing
**Solution:**
1. Check if user is subscribed
2. Verify `freeAttempts` setting in admin
3. Ensure question index is being counted correctly
4. Check localStorage for subscription status

---

## Future Enhancements

1. **Typing Indicator** - Show "AI is typing..." while waiting
2. **Typing Animation** - Animate answer character by character
3. **Search Improvements** - Use fuzzy matching or AI embeddings
4. **Real AI Integration** - Connect to actual AI model for better answers
5. **Conversation Memory** - Remember context across questions
6. **Analytics** - Track which questions are most asked
7. **Feedback System** - Users rate answer helpfulness
8. **Multi-language Support** - Translate questions and answers
9. **Question Suggestions** - Recommend questions based on progress
10. **Answer Refinement** - Update answers based on user feedback

