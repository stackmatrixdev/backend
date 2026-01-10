# 🛠️ CORRECTED AI COACH IMPLEMENTATION PLAN

## 🎯 Current State vs. Target State

### Current Implementation Issues
❌ Guided questions just set the input field (line 494: `setInputValue(q.question)`)  
❌ No separate "Guided Learning Path" tab with pre-made answers  
❌ API is called for all questions, not just "Free Questions"  
❌ No skill level selector visible at top  
❌ No clear separation between "Guided" and "Free" sections  

### Target Implementation
✅ Skill level selector at top (Beginner/Intermediate/Advanced)  
✅ Two distinct tabs: "Guided Learning Path" and "Free Questions"  
✅ Guided tab: Click question → Show pre-made answer (NO API)  
✅ Free tab: Type question → Call API → Show response with credit limit  
✅ Skill level used ONLY in Free Questions API calls  
✅ Clear credit limit enforcement (3 free messages)  

---

## 📋 Implementation Steps

### Step 1: Add Skill Level Selector (At Top of Main Content)

**Location:** After the Header in main content area (around line 560 in the file)

**Code:**
```jsx
// Add state for skill level (near line 45)
const [skillLevel, setSkillLevel] = useState("beginner");

// Add skill level selector in header area
<div className="border-b border-gray/50 px-6 py-4 flex justify-between items-center">
  {/* Right side - Skill Level Selector */}
  <div className="text-right w-full">
    <label className="text-sm text-gray font-semibold mr-3">
      Skill Level:
    </label>
    <select 
      value={skillLevel}
      onChange={(e) => setSkillLevel(e.target.value)}
      className="px-3 py-1 border border-blue-300 rounded-lg text-sm font-medium"
    >
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
    
    {/* Credit display */}
    <span className="ml-4 text-sm text-gray font-semibold">
      Remaining {Math.max(0, 3 - chatCount)}/3
    </span>
  </div>
</div>
```

---

### Step 2: Add Tab Navigation (Below Skill Level)

**Location:** Below header, before chat area

**Code:**
```jsx
// Add state for current tab (near line 45)
const [activeTab, setActiveTab] = useState("guided"); // "guided" or "free"

// Add tab buttons below header
<div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
  <div className="flex gap-4">
    <button
      onClick={() => setActiveTab("guided")}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === "guided"
          ? "bg-blue-500 text-white"
          : "bg-white text-gray-700 border border-gray-300"
      }`}
    >
      📚 Guided Learning Path
    </button>
    <button
      onClick={() => setActiveTab("free")}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === "free"
          ? "bg-blue-500 text-white"
          : "bg-white text-gray-700 border border-gray-300"
      }`}
    >
      💬 Free Questions
    </button>
  </div>
</div>
```

---

### Step 3: Separate Guided Learning Path Content

**For "Guided" Tab - Display Pre-made Questions as List**

```jsx
{activeTab === "guided" && (
  <div className="flex-1 flex flex-col items-center h-[70vh] overflow-y-auto p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">
      📚 Guided Learning Path
    </h2>
    
    {program && program.guidedQuestions?.enabled ? (
      <div className="w-full max-w-2xl space-y-3">
        <p className="text-gray-600 mb-4">
          Click a question to see the answer:
        </p>
        
        {program.guidedQuestions.questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleGuidedQuestionClick(q)}
            className="w-full text-left px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="text-blue-900 font-medium">
              {idx + 1}. {q.question}
            </span>
          </button>
        ))}
      </div>
    ) : (
      <div className="text-gray-400 text-lg p-4">
        No guided questions available for this course
      </div>
    )}
    
    {/* Display guided conversation if any */}
    {conversations.length > 0 && (
      <div className="mt-8 w-full max-w-2xl">
        <div className="flex flex-col gap-3">
          {conversations.map((msg, idx) => (
            <div key={idx} className="flex gap-2">
              {msg.sender === "ai" && (
                <img src={botProfile} className="w-8 h-8 rounded-full" alt="" />
              )}
              <div className={`flex-1 px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-gray-900"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}
```

**Handler for Guided Questions:**

```jsx
// Add this function (near handleSendMessage)
const handleGuidedQuestionClick = (guidedQuestion) => {
  // Add user message
  setConversations(prev => [...prev, {
    sender: "user",
    text: guidedQuestion.question
  }]);
  
  // Immediately add pre-made answer (NO API CALL)
  setConversations(prev => [...prev, {
    sender: "ai",
    text: guidedQuestion.answer  // Pre-made answer from admin
  }]);
  
  // Clear input (if any)
  setInputValue("");
};
```

---

### Step 4: Separate Free Questions Content

**For "Free" Tab - Chat Interface with API**

```jsx
{activeTab === "free" && (
  <div className="flex-1 flex flex-col items-center justify-between h-[70vh]">
    {/* Chat messages area */}
    <div className="w-full flex-1 overflow-y-auto px-6 py-4">
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Sparkles className="w-12 h-12 text-blue-500 mb-4" />
          <p className="text-xl text-gray-700 font-semibold">
            Ask your LearnGPT anything
          </p>
          <p className="text-gray-500 mt-2">
            You have {Math.max(0, 3 - chatCount)} free questions left
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {conversations.map((msg, idx) => (
            <div key={idx} className="flex gap-2">
              {msg.sender === "ai" && (
                <img src={botProfile} className="w-8 h-8 rounded-full" alt="" />
              )}
              <div className={`flex-1 max-w-md px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-gray-900"
              }`}>
                <p>{msg.text}</p>
                
                {/* Show sources if AI response */}
                {msg.sender === "ai" && msg.sources && (
                  <div className="mt-2 text-xs bg-white bg-opacity-80 p-2 rounded text-gray-800">
                    <p className="font-semibold">Sources:</p>
                    {msg.sources.slice(0, 2).map((src, sidx) => (
                      <p key={sidx}>{src.module}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isAiResponding && (
            <div className="flex gap-2">
              <img src={botProfile} className="w-8 h-8 rounded-full" alt="" />
              <div className="flex gap-1 px-4 py-2 bg-gray-200 rounded-lg">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    
    {/* Input area */}
    <div className="w-full border-t border-gray-200 p-4">
      {Math.max(0, 3 - chatCount) > 0 ? (
        <div className="flex gap-2 max-w-2xl mx-auto">
          <textarea
            ref={textAreaRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask your question..."
            className="flex-1 px-4 py-2 border border-blue-300 rounded-lg resize-none max-h-32 focus:outline-none"
            rows={1}
          />
          <button
            onClick={handleSendFreeQuestion}
            disabled={isAiResponding || !inputValue.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isAiResponding ? "..." : <Send className="w-5 h-5" />}
          </button>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">
          <p className="font-semibold mb-2">No free questions remaining</p>
          <button
            onClick={() => setShowPricingModal(true)}
            className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  </div>
)}
```

**Handler for Free Questions (Updated):**

```jsx
const handleSendFreeQuestion = async () => {
  // Step 1: Validate credits
  if (Math.max(0, 3 - chatCount) <= 0) {
    setShowPricingModal(true);
    toast.error("No free questions remaining. Please upgrade.");
    return;
  }
  
  if (!inputValue.trim()) return;
  
  // Step 2: Add user message to chat
  setConversations(prev => [...prev, {
    sender: "user",
    text: inputValue
  }]);
  
  // Step 3: Show typing indicator
  setIsAiResponding(true);
  setInputValue("");
  
  // Step 4: Call API with skillLevel
  try {
    const result = await aiChatAPI.sendMessageToExternalAI(
      inputValue,           // Question
      skillLevel,           // Skill level selected at top (beginner/intermediate/advanced)
      sessionId,            // Session ID
      programId             // Program ID
    );
    
    // Step 5: Display response
    if (result.success) {
      setConversations(prev => [...prev, {
        sender: "ai",
        text: result.data.response,
        sources: result.data.sources,
        metadata: result.data.metadata
      }]);
      
      // Step 6: Increment chat count (tracks credits used)
      setChatCount(prev => prev + 1);
      
      // Step 7: Show remaining credits
      const remaining = 3 - (chatCount + 1);
      if (remaining <= 0) {
        toast.error("You've used all free questions!");
      } else if (remaining === 1) {
        toast.info(`You have ${remaining} free question remaining`);
      }
    } else {
      toast.error(result.error || "Failed to get response");
      setConversations(prev => [...prev, {
        sender: "ai",
        text: `Error: ${result.error}`
      }]);
    }
  } catch (error) {
    toast.error("An error occurred. Please try again.");
    console.error(error);
  }
  
  setIsAiResponding(false);
};
```

---

### Step 5: Modify Sidebar (Remove old guided questions)

**Remove the guided questions dropdown from sidebar** since it's now in the main tab area.

---

## 📊 State Variables Needed

```javascript
// Skill Level (at top of component, around line 45)
const [skillLevel, setSkillLevel] = useState("beginner");

// Tab state (at top of component)
const [activeTab, setActiveTab] = useState("guided"); // "guided" or "free"

// Existing ones to keep
const [conversations, setConversations] = useState([...]);
const [chatCount, setChatCount] = useState(0); // Tracks API calls in Free tab
const [inputValue, setInputValue] = useState("");
const [isAiResponding, setIsAiResponding] = useState(false);
const [sessionId, setSessionId] = useState(null);
const [freeCredits, setFreeCredits] = useState(3);
```

---

## 🔑 Key Differences

| Aspect | Guided Learning Path | Free Questions |
|--------|----------------------|-----------------|
| **Data Source** | Pre-made from admin | User input |
| **API Call** | ❌ NO | ✅ YES (with skillLevel) |
| **Handler** | `handleGuidedQuestionClick()` | `handleSendFreeQuestion()` |
| **Credit Cost** | 0 (always free) | 1 per question |
| **Skill Level Used** | ❌ NO | ✅ YES (passed to API) |
| **Answer Display** | Immediate (stored) | After API response (2-5s) |
| **Limit** | None | 3 free, then paid |

---

## ✅ Implementation Checklist

- [ ] Add `skillLevel` state variable
- [ ] Add `activeTab` state variable
- [ ] Add skill level selector to header
- [ ] Add tab navigation buttons
- [ ] Create "Guided Learning Path" tab content
- [ ] Implement `handleGuidedQuestionClick()` function
- [ ] Create "Free Questions" tab content
- [ ] Update API call to use `skillLevel` parameter
- [ ] Update `handleSendFreeQuestion()` with proper credit checking
- [ ] Remove guided questions from sidebar (or make them tabs)
- [ ] Update styling to match new layout
- [ ] Test Guided tab (no API calls, immediate answers)
- [ ] Test Free tab (with API calls, credit limits)
- [ ] Test skill level changes in Free tab

---

## 🧪 Testing Scenarios

### Scenario 1: Test Guided Learning Path
1. Click "Guided Learning Path" tab
2. Click a pre-made question
3. ✅ Answer should appear immediately (no loading)
4. ✅ No API call should be made
5. ✅ Credit counter should NOT change

### Scenario 2: Test Free Questions with API
1. Click "Free Questions" tab
2. Change skill level to "Intermediate"
3. Type custom question: "What is Scrum?"
4. Click Send
5. ✅ API call made with skill_level="intermediate"
6. ✅ Response appears after 2-5 seconds
7. ✅ Credit counter: 3 → 2
8. ✅ Remaining shows "2/3"

### Scenario 3: Test Credit Limit
1. Send 3 questions in Free tab
2. ✅ Credit counter goes: 3 → 2 → 1 → 0
3. ✅ Input disabled when credits = 0
4. ✅ "Upgrade Now" button appears
5. ✅ Clicking shows pricing modal

### Scenario 4: Test Skill Level Changes
1. In Free Questions tab, select "Advanced"
2. Send question
3. ✅ API request includes "skill_level": "advanced"
4. Change to "Intermediate"
5. Send another question
6. ✅ API request includes "skill_level": "intermediate"

---

## 📝 Summary

This corrected implementation properly separates:

1. **Guided Learning Path** - Static Q&A from admin (no API, no credits)
2. **Free Questions** - Dynamic Q&A from real API (with credits, uses skillLevel)
3. **Skill Level** - Selector at top, used only in Free Questions API calls
4. **Credit System** - 3 free questions in Free tab only, Guided tab unlimited

**Ready to implement?** Start with Step 1: Add skill level selector!
