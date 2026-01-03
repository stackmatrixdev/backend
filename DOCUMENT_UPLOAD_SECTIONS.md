# 📚 Document Upload System - Free & Premium File Sections

## ✅ Implementation Complete!

The Document upload system in "Create New Training" now has **separate dedicated sections** for managing Free and Premium files.

---

## 🎨 UI Layout

### **Header Section**
```
📚 Manage Training Documents
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Organize your course materials by uploading free and premium content.
```

### **Tier Selection Buttons** (Side by Side)
```
┌─────────────────────────┐  ┌─────────────────────────┐
│ 🔓 Free Files           │  │ 🔒 Premium Files        │
│    X documents          │  │    Y documents          │
└─────────────────────────┘  └─────────────────────────┘
     ✓ Active (Green)            Inactive (Gray)
```

---

## 📤 Upload Section

### **Dynamic Upload Form** (Changes based on selected tier)

**When "Free Files" is selected:**
```
╔════════════════════════════════════════════════╗
║ 🔓 Upload to Free Files Section                ║
║ Free content will be accessible to all users   ║
║                                                ║
║ Document Type: [PDF] [Video] [YouTube] ...     ║
║ Title: ____________________________________    ║
║ Description: _____________________________     ║
║ [File/URL Input based on type]                ║
║                                                ║
║ [➕ Add to Free Files]                         ║
╚════════════════════════════════════════════════╝
```

**When "Premium Files" is selected:**
```
╔════════════════════════════════════════════════╗
║ 🔒 Upload to Premium Files Section             ║
║ Premium content requires active subscription   ║
║                                                ║
║ Document Type: [PDF] [Video] [YouTube] ...     ║
║ Title: ____________________________________    ║
║ Description: _____________________________     ║
║ [File/URL Input based on type]                ║
║                                                ║
║ [➕ Add to Premium Files]                      ║
╚════════════════════════════════════════════════╝
```

---

## 📁 File Management Display

### **Side-by-Side Sections**

```
┌──────────────────────────────┐  ┌──────────────────────────────┐
│ 🔓 Free Files            [3] │  │ 🔒 Premium Files         [5] │
├──────────────────────────────┤  ├──────────────────────────────┤
│                              │  │                              │
│ 📄 Immigration Guide.pdf     │  │ 📄 Advanced Topics.pdf       │
│    PDF • 2.5 MB              │  │    PDF • 3.1 MB              │
│    [Delete]                  │  │    [Delete]                  │
│                              │  │                              │
│ 🎥 Welcome Video.mp4         │  │ 📺 Expert Interview          │
│    Video • 45.2 MB           │  │    YouTube                   │
│    [Delete]                  │  │    [Delete]                  │
│                              │  │                              │
│ 🔗 Official Website          │  │ 📊 Pro Slides Deck           │
│    Link                      │  │    Google Slides             │
│    [Delete]                  │  │    [Delete]                  │
│                              │  │                              │
└──────────────────────────────┘  └──────────────────────────────┘
   Green border & background         Yellow border & background
```

---

## 🎯 Key Features

### **1. Clear Visual Separation**
- **Free Files**: Green theme (🟢 Green borders, backgrounds, buttons)
- **Premium Files**: Yellow/Orange theme (🟡 Yellow borders, backgrounds, buttons)

### **2. Document Type Support**
- 📄 **PDF** - Upload PDF files
- 🎥 **Video** - Upload video files  
- 📺 **YouTube** - Embed YouTube videos via URL
- 📊 **Google Slides** - Embed presentation via URL
- 🔗 **External Link** - Link to external resources

### **3. Smart Form Handling**
- **File Upload** (PDF & Video): Shows file picker with size display
- **URL Input** (YouTube, Slides, Links): Shows URL input with validation
- **Auto-reset**: Form clears after successful upload

### **4. Real-time Document Lists**
- **Live count badges**: Shows number of files in each section
- **Document cards**: Display title, type, size, description
- **Quick delete**: One-click deletion with confirmation
- **Auto-refresh**: Lists update immediately after upload/delete

### **5. Auto-fetch on Load**
- Automatically loads existing documents when component mounts
- Shows loading spinner during fetch
- Organizes documents into Free/Premium sections

---

## 🔄 Workflow

### **Creating New Training with Documents:**

1. **Basic Info Step** → Training created, `programId` stored in context
2. **Document Step** → Access document upload interface
3. **Select Tier** → Click "Free Files" or "Premium Files" button
4. **Choose Type** → Click PDF, Video, YouTube, Slides, or Link
5. **Fill Form** → Enter title, description, select file/enter URL
6. **Upload** → Click "Add to [Free/Premium] Files" button
7. **View Results** → Document appears in corresponding section below

### **Managing Existing Files:**

- **View All**: See all Free and Premium files side-by-side
- **Delete**: Click delete icon on any document card
- **Add More**: Switch tiers and upload additional content
- **Counts Update**: Badge numbers update in real-time

---

## 🔧 Technical Implementation

### **Component: `Document.jsx`**
Location: `/front-end/src/components/Admin/Quizz/Document.jsx`

### **State Management:**
```javascript
const [activeTier, setActiveTier] = useState("free");
const [uploadType, setUploadType] = useState("pdf");
const [uploading, setUploading] = useState(false);
const [loading, setLoading] = useState(false);
const [documents, setDocuments] = useState({ free: [], premium: [] });
const [formData, setFormData] = useState({
  title: "",
  description: "",
  file: null,
  externalUrl: ""
});
```

### **API Integration:**
- **POST** `/api/programs/:id/documents` - Upload new document
- **GET** `/api/programs/:id/documents` - Fetch all documents
- **DELETE** `/api/programs/:id/documents/:docId` - Delete document

### **Context Integration:**
```javascript
const { state } = useTrainingCreation();
const currentProgramId = programId || state.creation.createdProgramId;
```

---

## 📊 Database Schema

### **Program.documentation Structure:**
```json
{
  "documentation": {
    "free": [
      {
        "_id": "doc_id",
        "title": "Immigration Guide",
        "description": "Complete guide for beginners",
        "type": "pdf",
        "fileUrl": "/storage/documents/file.pdf",
        "fileName": "immigration-guide.pdf",
        "fileSize": 2621440,
        "uploadedAt": "2026-01-02T..."
      }
    ],
    "premium": [
      {
        "_id": "doc_id",
        "title": "Expert Interview",
        "description": "In-depth discussion",
        "type": "youtube",
        "externalUrl": "https://youtube.com/...",
        "uploadedAt": "2026-01-02T..."
      }
    ]
  }
}
```

---

## ✨ Visual Enhancements

### **Color Coding:**
- **Free Section**: 
  - Primary: `bg-green-500`, `border-green-200`
  - Gradient: `from-green-50 to-white`
  - Icons: `text-green-600`

- **Premium Section**:
  - Primary: `bg-yellow-500`, `border-yellow-200`
  - Gradient: `from-yellow-50 to-white`
  - Icons: `text-orange-600`

### **Interactive Elements:**
- Hover effects on all buttons
- Scale animations on tier selection
- Smooth transitions between states
- Loading spinner during operations
- Toast notifications for success/error

### **Responsive Design:**
- Desktop: Side-by-side sections (2 columns)
- Tablet: Stacked sections (1 column)
- Mobile: Full-width with touch-friendly buttons

---

## 🎓 User Experience

### **For Administrators:**
1. **Clear Organization**: Separate sections eliminate confusion
2. **Visual Feedback**: Color coding shows tier at a glance
3. **Quick Actions**: Upload and delete in minimal clicks
4. **Real-time Updates**: See changes immediately
5. **Type Flexibility**: Support for multiple content formats

### **For End Users (Documentation.jsx):**
1. **Free Content**: Always accessible, no restrictions
2. **Premium Content**: Locked with 🔒 icon, requires subscription
3. **Choose Plan**: Button to unlock premium content
4. **Seamless Viewing**: All document types render properly

---

## 🚀 Next Steps

### **Completed:**
✅ Free/Premium tier separation
✅ Visual distinction with color coding
✅ Side-by-side upload sections
✅ Document type support (5 types)
✅ Auto-fetch existing documents
✅ Real-time count badges
✅ Delete functionality
✅ Form validation
✅ Loading states
✅ Error handling

### **Ready for Production:**
✅ Component compiles successfully
✅ API integration complete
✅ Context properly connected
✅ UI fully responsive
✅ File management working

---

## 📝 Summary

The document upload system now provides a **professional, organized interface** for managing training materials with clear separation between **Free** and **Premium** content. The visual design makes it immediately obvious which section you're working with, and the side-by-side display allows for efficient file management across both tiers.

**Location:** Create New Training → Document Step
**Status:** ✅ Production Ready
**Last Updated:** January 2, 2026
