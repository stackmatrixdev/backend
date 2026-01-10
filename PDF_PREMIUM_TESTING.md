# 🧪 TESTING GUIDE - PDF Preview & Premium Lock

## After the fixes, test these:

### 🔧 **Fix 1: PDF Preview**
1. **Refresh your browser** (Ctrl+Shift+R to clear cache)
2. **As a user, go to Documentation tab**
3. **Click on "Python Basic" (free document)**
4. **Check browser console for logs:**
   ```
   🔗 [Documentation] First free document URL: /storage/documents/some-file.pdf
   PDF URL: /storage/documents/some-file.pdf
   ```
5. **PDF should now load** (not show "No preview available")

### 🔧 **Fix 2: Premium Lock**
1. **You should see 2 documents in sidebar:**
   - ✅ "Python Basic" (clickable)
   - 🔒 "🔒 Full python pdf" (grayed out)
2. **Click on the locked document**
3. **Should show upgrade popup** with pricing plans
4. **Main content area should show lock icon** with "Premium Content" message

### 🔍 **If PDF still doesn't load:**

Check these in browser console:
```
PDF URL: /storage/documents/your-file.pdf
Full iframe src: https://docs.google.com/gview?url=http://localhost:5000/storage/documents/your-file.pdf&embedded=true
```

**Backend should serve files at:** `http://localhost:5000/storage/documents/`

Test direct access: 
```bash
curl -I http://localhost:5000/storage/documents/file-sample_150kB.pdf
```

Should return `200 OK` if file exists.

### 📋 **Expected Results:**
✅ Free document loads with PDF preview
✅ Premium document shows lock icon in sidebar  
✅ Premium document shows upgrade message when clicked
✅ Upgrade popup appears when clicking locked content
✅ Premium documents are grayed out and unclickable

### ❌ **If still not working:**

1. **Check file exists:**
   ```bash
   ls -la /home/root_coder/Downloads/demo/backend/storage/documents/
   ```

2. **Check backend logs** for file serving errors

3. **Check browser Network tab** for failed requests to `/storage/documents/`

4. **Try alternative PDF viewer** (if Google Docs viewer fails):
   Update PDF iframe src to:
   ```javascript
   src={currentLesson.content}  // Direct file access
   ```

### 🎯 **Success Indicators:**
- Free PDF loads and displays content
- Premium content shows 🔒 icon and can't be accessed
- Console shows proper file URLs
- No "No preview available" errors
- Upgrade popup works when clicking locked content

**Test now and report back!** 🚀