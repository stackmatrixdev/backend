# 🐛 STEP-BY-STEP DEBUGGING GUIDE

## Let's solve this once and for all! Follow these steps exactly:

### Step 1: Start Backend Server
```bash
cd /home/root_coder/Downloads/demo/backend
npm start
```

**WAIT** until you see:
```
🚀 Server running on port 5000
📡 Environment: development
✅ MongoDB Connected Successfully
```

### Step 2: Start Frontend (In New Terminal)
```bash
cd /home/root_coder/Downloads/demo/backend/front-end
npm run dev
```

### Step 3: Upload a Document (Admin)
1. **Login as admin**
2. **Go to programs list** 
3. **Click on any program** (note the URL - it should be like `/programs/SOME_ID`)
4. **Write down this Program ID**: `___________________`
5. **Go to Documents/Documentation section**
6. **Upload a test file**:
   - Title: "Debug Test Doc"
   - Tier: "free" 
   - Type: "pdf"
   - Upload any PDF file
7. **Click Upload**

**CHECK BACKEND TERMINAL - You should see:**
```
📤 [addDocument] ===== UPLOAD START =====
📤 [addDocument] Program ID: 6961811a5b2ce34d361cb1b1
📤 [addDocument] Title: Debug Test Doc
📤 [addDocument] Type: pdf
📤 [addDocument] Tier: free
📤 [addDocument] Has file: true
✅ [addDocument] Program found: Your Program Name
📁 [addDocument] File uploaded: document-1234567.pdf
💾 [addDocument] Program saved successfully
📤 [addDocument] ===== UPLOAD END =====
```

**CHECK BROWSER CONSOLE - You should see:**
```
📤 [ProgramDocuments] ===== UPLOAD START =====
📤 [ProgramDocuments] Program ID: 6961811a5b2ce34d361cb1b1
📤 [ProgramDocuments] Tier: free
📤 [ProgramDocuments] Sending to: http://localhost:5000/api/programs/6961811a5b2ce34d361cb1b1/documents
📥 [ProgramDocuments] Response status: 200
📤 [ProgramDocuments] ===== UPLOAD END =====
```

**❓ Did you see these logs? YES / NO**: `_______`

If NO, there's an upload problem.
If YES, continue to Step 4.

### Step 4: View as User
1. **Logout from admin** 
2. **Login as regular user**
3. **Go to the SAME program** (use the same URL/ID from Step 3)
4. **Click on "Documentation" tab**
5. **Open browser console (F12)**

**YOU SHOULD SEE THESE LOGS:**
```
🔍 [Documentation] Starting fetch for program ID: 6961811a5b2ce34d361cb1b1
📚 [Documentation] Free documents count: 1
📚 [Documentation] Premium documents count: 0
📖 [Documentation] Lessons count: 1
```

**❓ What do you see in console?**: 
```
Write the exact console output here:

[Paste logs here]
```

**❓ Can you see the document in the UI? YES / NO**: `_______`

### Step 5: Check Database
```bash
cd /home/root_coder/Downloads/demo/backend
node checkDocuments.js
```

**❓ How many documents does it show for your program?**: `_______`

### Step 6: Check Network Tab
1. **In browser, open DevTools (F12)**
2. **Go to "Network" tab**
3. **Refresh the documentation page**
4. **Look for request to `/api/programs/YOUR_ID/documents`**

**❓ What is the status code?**: `_______`
**❓ What is the response?**: 
```
[Paste response here]
```

---

## 🎯 Based on Your Results:

### If Upload Logs Missing:
- The URL fix didn't work
- Check if you're using the right admin component

### If Fetch Logs Show 0 Documents:
- Documents aren't saving to database
- Backend controller has issue

### If Fetch Logs Show 1+ Documents but No UI:
- Frontend display logic has issue
- Check lessons array generation

### If Network Tab Shows 401/404:
- Authentication or routing issue
- Wrong URL being called

---

## 📝 FILL OUT THIS FORM:

**Program ID used**: `___________________`
**Upload logs seen (Y/N)**: `_______`
**User fetch logs**: 
```
[Paste here]
```
**Database document count**: `_______`
**Network request status**: `_______`
**Can see document in UI (Y/N)**: `_______`

**SHARE ALL OF THIS WITH ME!** 🎯