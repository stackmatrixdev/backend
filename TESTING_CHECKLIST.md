# 🧪 Testing Checklist - AI Chat Integration

Use this checklist while testing to verify everything is working correctly.

---

## ✅ Pre-Test Setup

- [ ] Application running at http://localhost:5174
- [ ] DevTools open (F12)
- [ ] Console tab visible
- [ ] No JavaScript errors in console
- [ ] Session ID visible in console on page load

**Session ID format should look like:** `550e8400-e29b-41d4-a716-446655440000`

---

## ✅ Test 1: First Message

### Sending
- [ ] Navigate to Dashboard → AI Coach
- [ ] Message input is visible and focused
- [ ] Type test message: "What is a Sprint?"
- [ ] Click Send or press Enter

### Immediate Feedback
- [ ] ✅ User message appears in blue bubble (immediate)
- [ ] ✅ Input field clears
- [ ] ✅ Typing indicator appears (3 bouncing dots)
- [ ] ✅ Console shows: 📤 "Sending message to AI API..."

### Console Logs
- [ ] 📤 "Sending message to AI API..."
- [ ] Session ID logged (UUID format)
- [ ] Skill Level logged: "beginner"
- [ ] Message logged: "What is a Sprint?"
- [ ] 🔄 "Calling external AI API..."
- [ ] Endpoint logged: "http://10.10.7.82:8008/api/v1/chat/"
- [ ] Request payload logged with all 4 fields:
  - message ✅
  - skill_level ✅
  - session_id ✅
  - program_id ✅

### API Response (2-5 seconds)
- [ ] ✅ "API Response received:" appears in console
- [ ] Response contains: response, sources, metadata
- [ ] 📥 "Response from AI API:" logged
- [ ] ✅ "AI Response received:" logged
- [ ] Sources array logged
- [ ] Metadata object logged

### UI Display
- [ ] ✅ Typing indicator disappears
- [ ] ✅ AI response appears in gray bubble
- [ ] ✅ Response text is readable
- [ ] ✅ Sources section appears with 📚 icon
- [ ] ✅ Metadata section appears at bottom
- [ ] ✅ Free credits show: "Remaining 2/3"

### Network Tab (F12 → Network)
- [ ] ✅ POST request visible
- [ ] ✅ URL: "http://10.10.7.82:8008/api/v1/chat/"
- [ ] ✅ Status: 200
- [ ] ✅ Response time: reasonable (< 10 seconds)
- [ ] ✅ Request body contains all 4 fields
- [ ] ✅ Response body contains response, sources, metadata

---

## ✅ Test 2: Sources Display

### Visual Check
- [ ] Sources section visible
- [ ] 📚 Icon showing
- [ ] "Sources:" label visible
- [ ] At least 1 source item displayed

### Source Details (for each source)
- [ ] Module name visible (e.g., "ENG_Module1_Scrum.docx")
- [ ] Relevance percentage shown (e.g., "71%")
- [ ] Content preview text visible
- [ ] Preview text is readable (not cut off)

### Example:
```
📚 Sources:
ENG_Module1_Scrum.docx (Relevance: 71%)
📚 Complete Educational Source – Module 1: Introduction to Scrum...
```

---

## ✅ Test 3: Metadata Display

### Visual Check
- [ ] Metadata section visible
- [ ] Appears below message
- [ ] Light gray background
- [ ] Text is readable

### Metadata Items (if present in response)
- [ ] Model name shown (e.g., "gpt-4.1-mini")
- [ ] Response time shown (e.g., "3040ms")
- [ ] Tokens used shown (e.g., "718")

### Example:
```
Model: gpt-4.1-mini  |  Response: 3040ms  |  Tokens: 718
```

---

## ✅ Test 4: Second Message (Free Message #2)

### Setup
- [ ] Chat still visible
- [ ] Both previous messages visible
- [ ] Credit counter shows "2/3"

### Sending
- [ ] Type: "How do Sprints help with product delivery?"
- [ ] Click Send

### Immediate Feedback
- [ ] User message appears in blue bubble
- [ ] Typing indicator appears
- [ ] 📤 log appears in console

### API Response
- [ ] 🔄 log appears
- [ ] ✅ API response received log appears
- [ ] AI response appears in gray bubble
- [ ] Sources displayed
- [ ] Metadata displayed

### Credits
- [ ] Credit counter updates to "1/3"
- [ ] Toast notification appears: "You have 1 free message remaining"

### Conversation
- [ ] Both user messages visible (in blue)
- [ ] Both AI responses visible (in gray)
- [ ] All sources and metadata visible

---

## ✅ Test 5: Third Message (Free Message #3)

### Sending
- [ ] Type: "What happens during sprint ceremonies?"
- [ ] Click Send

### Verification
- [ ] User message appears
- [ ] Typing indicator appears
- [ ] AI response appears with sources and metadata
- [ ] Credit counter shows "0/3"

### Console
- [ ] All logs appear as expected
- [ ] No errors in console
- [ ] API request successful (status 200)

---

## ✅ Test 6: Fourth Message (Triggers Upgrade)

### Attempting to Send
- [ ] Credit counter shows "0/3"
- [ ] Type: "Are there different types of Sprints?"
- [ ] Click Send

### Expected Behavior
- [ ] Message does NOT send
- [ ] Error toast appears: "You've used all your free messages. Please upgrade to continue."
- [ ] Pricing modal appears
- [ ] Modal shows upgrade options
- [ ] Message input is still visible
- [ ] No API request made (check Network tab)

### Console Check
- [ ] No 🔄 log (no API call made)
- [ ] Error message in console: "You've used all your free messages..."

---

## ❌ Error Scenarios (What to Do If...)

### Scenario 1: "Session ID is not initialized!" Error
- [ ] Appears in error message
- [ ] Shows in console: ❌ "Session ID is not initialized!"

**Action:**
- Refresh page (F5)
- Try sending message again
- Session ID should initialize on page load

### Scenario 2: Network Error
- [ ] Console shows: ❌ "Error sending message to external AI: Network Error"
- [ ] No 📥 response log appears
- [ ] Typing indicator stays visible

**Action:**
- Check if http://10.10.7.82:8008 is accessible
- Verify AI server is running
- Try to ping server: `curl http://10.10.7.82:8008`

### Scenario 3: Request Hangs (No Response)
- [ ] 🔄 "Calling external AI API..." appears
- [ ] Nothing happens for > 10 seconds
- [ ] Typing indicator keeps animating

**Action:**
- Check Network tab for POST request
- Look at Status: should show either 200, error code, or "pending"
- If pending: API server not responding, check server logs
- If error code: API rejected request, check response body

### Scenario 4: Wrong Response Format
- [ ] ✅ "API Response received:" appears
- [ ] But response doesn't have expected fields
- [ ] Sources or metadata not displaying

**Action:**
- Check console for what was actually in response
- Verify AI server is sending correct format
- Check response in Network tab

### Scenario 5: CORS Error
- [ ] Console error: "CORS policy..."
- [ ] Blocked by browser
- [ ] Network tab shows error

**Action:**
- Contact AI server admin
- Ask to enable CORS headers
- Required: `Access-Control-Allow-Origin: *`

---

## 🎯 Success Criteria

### Test Passes If:
- ✅ First message sends and receives response within 5 seconds
- ✅ Sources display with module names and relevance
- ✅ Metadata displays with model, time, tokens
- ✅ Free credits decrement correctly (3 → 2 → 1 → 0)
- ✅ Fourth message triggers upgrade modal
- ✅ All console logs show expected emoji indicators
- ✅ Network tab shows 200 status for API requests
- ✅ All 4 request parameters present (message, skill_level, session_id, program_id)

### Test Fails If:
- ❌ No API request made (check Network tab)
- ❌ API returns error status (not 200)
- ❌ Response doesn't have sources or metadata
- ❌ Console shows ❌ errors
- ❌ User messages don't send
- ❌ AI responses don't display

---

## 📊 Performance Expectations

| Metric | Expected | Max Acceptable |
|--------|----------|-----------------|
| Message send to display | Instant | < 100ms |
| Typing indicator start | < 100ms | < 500ms |
| API response time | 2-5 seconds | < 30 seconds |
| Sources display | Automatic | With response |
| Metadata display | Automatic | With response |
| Credit update | Immediate | < 1 second |

---

## 📝 Testing Notes

Use this space to document your test results:

```
Date: _______________
Tester: ______________

Test 1 - First Message:
[ ] PASS [ ] FAIL
Notes: _________________________________________________

Test 2 - Sources Display:
[ ] PASS [ ] FAIL
Notes: _________________________________________________

Test 3 - Metadata Display:
[ ] PASS [ ] FAIL
Notes: _________________________________________________

Test 4 - Second Message:
[ ] PASS [ ] FAIL
Notes: _________________________________________________

Test 5 - Third Message:
[ ] PASS [ ] FAIL
Notes: _________________________________________________

Test 6 - Fourth Message (Upgrade):
[ ] PASS [ ] FAIL
Notes: _________________________________________________

Overall Result:
[ ] ALL PASS ✅
[ ] SOME FAIL ❌

Issues Found:
_________________________________________________________

Resolution:
_________________________________________________________
```

---

## 🎯 Final Verification

Before declaring success:

- [ ] All 6 tests completed
- [ ] No ❌ errors in console
- [ ] All network requests returned 200
- [ ] Sources and metadata displayed correctly
- [ ] Credit system working as expected
- [ ] Upgrade modal appears after 3 free messages
- [ ] No breaking changes to existing features

---

## ✨ Ready to Declare Success!

If all checkboxes above are checked, the AI Chat integration is working correctly and ready for production.

**Congratulations! 🎉**
