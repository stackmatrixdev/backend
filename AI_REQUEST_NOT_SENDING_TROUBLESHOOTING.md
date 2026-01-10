# 🚨 AI API Not Sending Request - Troubleshooting

## Problem Summary

You're asking questions to the AI but:
- ❌ No request is being sent to the AI API
- ❌ No response comes back
- ❌ Nothing appears to happen

---

## Root Causes (In Order of Likelihood)

### 1. AI API Server is Down or Unreachable

**Check:** Is the server running?

```bash
# Test in terminal
curl http://10.10.7.82:8008

# Expected: Some response (even an error page)
# If: Connection refused → Server is DOWN
```

**Fix:** Start the AI API server or check with administrator

---

### 2. Session ID Not Initialized

**Check:** In Console, before sending message, look for:
```
Session ID: [UUID]
```

**If Missing:** Session wasn't created

**Fix:**
```javascript
// In browser console (F12)
location.reload();  // Reload page
// Wait 2 seconds
// Try sending message again
```

---

### 3. Message Input is Empty

**Check:** Did you actually type something?

**Fix:**
- Type a message: "What is React?"
- Make sure text appears in input box
- Click Send or press Enter

---

### 4. All 3 Free Messages Used

**Check:** Header shows "Remaining 0/3"?

**Fix:**
- You need to upgrade to send more messages
- OR clear browser data and reload (new session)

---

### 5. Wrong API Endpoint URL

**Check:** Is endpoint correct?

**Should be:**
```
http://10.10.7.82:8008/api/v1/chat/
```

**Fix:** Update in `api.service.js` line ~305

---

### 6. CORS Error (Cross-Origin Request)

**Check:** Console shows "CORS policy"?

**Fix:** Contact API administrator
- Ask to allow origin: `http://localhost:5174`
- Or enable CORS wildcard

---

## Systematic Debugging

### Stage 1: Is Page Loading?

1. Open browser DevTools (F12)
2. Go to Console tab
3. You should see NO red errors

**If you see red errors:**
- Fix those first
- Reload page
- Try again

---

### Stage 2: Is Session Initializing?

1. Reload page
2. Wait 2 seconds
3. Check Console (should be quiet, no errors)
4. Message about session appearing?

**Expected:** Nothing visible, no errors

**If error:** See "Session ID is not initialized" → Clear cache and reload

---

### Stage 3: Try Sending Message

1. Type: "Hello"
2. Press Enter
3. **IMMEDIATELY** watch Console

**Expected Logs in Order:**
```
📤 Sending message to AI API...
Session ID: ...
Skill Level: beginner
Message: Hello
🔄 Calling external AI API...
Endpoint: http://10.10.7.82:8008/api/v1/chat/
```

**If you see above:** Request is being made! Go to Stage 4

**If you don't see above:** Something is blocking the request
- Check if error messages appear
- Check if message was empty
- Check if credits expired

---

### Stage 4: Did API Respond?

**Look for in Console:**
```
✅ API Response received: {...}
```

**If YES:** API is working! Problem is with response display
- Check response data is valid
- Check parsing is working

**If NO:** API didn't respond
- **Check Network tab:**
  1. Open Network tab
  2. Send message
  3. Look for request to `/chat/`
  4. Check status code
     - **200:** API responded ✅
     - **4xx:** Bad request
     - **5xx:** Server error
     - **No request:** Request never sent

---

## Specific Error Solutions

### Error: "Session ID is not initialized!"

```
❌ Session ID is not initialized!
```

**Cause:** Component loaded but session didn't create  
**Fix:**
```javascript
// Option 1: Reload page
location.reload();

// Option 2: Clear cache
// Ctrl+Shift+Delete → Clear all
```

---

### Error: "Network Error"

```
❌ Error sending message to external AI: Error: Network Error
```

**Cause:** Can't reach API server  
**Check:**
```bash
ping 10.10.7.82
curl http://10.10.7.82:8008
```

**Fix:**
- Is AI server running?
- Is IP address correct?
- Is firewall blocking?
- Can you access from terminal?

---

### Error: "Access to XMLHttpRequest blocked by CORS policy"

```
❌ Access to XMLHttpRequest blocked by CORS policy
```

**Cause:** API doesn't allow requests from this origin  
**Fix:** Contact API admin, ask to enable CORS

---

### Error: "404 Not Found"

```
❌ Error: 404 - Not Found
```

**Cause:** Wrong path or endpoint  
**Check:** Is `/chat/` path correct?
**Fix:** Verify endpoint in api.service.js

---

### Error: "Connection timeout"

```
❌ Error: ECONNREFUSED or timeout
```

**Cause:** API server not responding  
**Fix:** Check if server is running, restart if needed

---

## Minimal Test Case

If you want to isolate the problem, test API directly:

### Test 1: Can You Reach the Server?

```bash
# In terminal
curl -v http://10.10.7.82:8008

# Should show: Connected to 10.10.7.82
```

---

### Test 2: Is the /chat/ Endpoint Working?

```bash
# In terminal
curl -X POST http://10.10.7.82:8008/api/v1/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","skill_level":"beginner","session_id":"test-123"}'

# Should return JSON with response, sources, metadata
```

---

### Test 3: Can Frontend Reach It?

```javascript
// In browser console (F12)
fetch('http://10.10.7.82:8008/api/v1/chat/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Test',
    skill_level: 'beginner',
    session_id: 'test-' + Date.now()
  })
})
  .then(r => { console.log('Status:', r.status); return r.json(); })
  .then(d => console.log('Success:', d))
  .catch(e => console.log('Error:', e.message));
```

---

## Decision Tree

```
Can you reach AI server from terminal?
├─ YES
│  └─ Can frontend reach it from browser?
│     ├─ YES
│     │  └─ Is request being made (Network tab)?
│     │     ├─ YES
│     │     │  └─ Does API respond (Status 200)?
│     │     │     ├─ YES → Response parsing issue
│     │     │     └─ NO → API error (check response)
│     │     └─ NO → Request not being sent (session/credit issue)
│     └─ NO → CORS issue (contact API admin)
└─ NO
   └─ AI server is down/unreachable (restart server)
```

---

## Data to Collect for Help

If you're still stuck, provide:

1. **Screenshot of Console** with all logs/errors visible
2. **Screenshot of Network tab** showing the /chat/ request
3. **Error message(s)** (copy-paste exact text)
4. **What you sent:** The exact message
5. **What you saw:** Did typing indicator appear?
6. **Terminal test results:**
   ```bash
   curl http://10.10.7.82:8008
   ```

---

## Verification Checklist

Before saying "it's not working", verify:

- [ ] Dev server is running (http://localhost:5174 loads)
- [ ] Page loads without console errors
- [ ] You typed something in the message box
- [ ] Credit counter shows > 0
- [ ] You waited > 2 seconds after loading page
- [ ] You opened DevTools Console (F12)
- [ ] You actually clicked Send

If all above are true and still not working, then we have a real issue to debug.

---

## Next Steps

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Send a message**
4. **Copy all console output** showing the logs
5. **Tell me what you see**

The console logs will guide us to the exact problem! 🔍

---

**Frontend URL:** http://localhost:5174 ✅  
**Dev Server:** Running on port 5174 ✅  
**Debugging Enabled:** Yes ✅  
**Ready to Test:** YES ✅

Let's find and fix this! 🚀
