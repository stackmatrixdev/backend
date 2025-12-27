# Making Course Content Dynamic - Implementation Guide

## Problem
Currently, the course overview page shows static content. We need all content to come from the admin dashboard and be stored in the database.

## Solution Overview

### 1. Database Schema (DONE ✅)
Added to Program.model.js:
- `overview` (String, 5000 chars) - Detailed course description
- `topicsCovered` (Array of Strings) - Bullet points of what's covered
- `courseSections` (Array of Objects) - Structured course sections
  - title: String
  - description: String  
  - topics: [String]
  - order: Number
- `learningObjectives` (Array of Strings) - What students will learn
- `thumbnail` (String) - Card image URL
- `coverImage` (String) - Header image URL
- `documentation` (Array of Objects) - Course materials
  - title: String
  - content: String
  - fileUrl: String
  - type: Enum (pdf, doc, video, link, text)

### 2. Admin Dashboard Updates Needed

#### A. Document Tab Enhancement
Add these fields after the existing Document Title/Category/Topic fields:

```jsx
{/* Course Overview Section */}
<div className="col-span-2 mt-6">
  <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
    Course Overview
    <InfoTooltip text="This will be shown as the main description on the course page" />
  </label>
  <textarea
    value={overview}
    onChange={(e) => setOverview(e.target.value)}
    className="w-full px-3 py-2 border rounded-lg h-32"
    placeholder="Enter detailed course description..."
  />
</div>

{/* Topics Covered */}
<div className="col-span-2 mt-4">
  <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
    Topics Covered
    <InfoTooltip text="Bullet points shown in 'Topics include:' section" />
  </label>
  {topicsCovered.map((topic, index) => (
    <div key={index} className="flex gap-2 mb-2">
      <input
        value={topic}
        onChange={(e) => updateTopicsCovered(index, e.target.value)}
        className="flex-1 px-3 py-2 border rounded-lg"
        placeholder="e.g., Understanding immigration requirements"
      />
      <button onClick={() => removeTopicsCovered(index)}>Delete</button>
    </div>
  ))}
  <button onClick={addTopicsCovered}>+ Add Topic</button>
</div>

{/* Learning Objectives */}
<div className="col-span-2 mt-4">
  <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
    Learning Objectives  
    <InfoTooltip text="What students will achieve by completing this course" />
  </label>
  {learningObjectives.map((objective, index) => (
    <div key={index} className="flex gap-2 mb-2">
      <input
        value={objective}
        onChange={(e) => updateLearningObjective(index, e.target.value)}
        className="flex-1 px-3 py-2 border rounded-lg"
        placeholder="e.g., Build confidence in speaking English"
      />
      <button onClick={() => removeLearningObjective(index)}>Delete</button>
    </div>
  ))}
  <button onClick={addLearningObjective}>+ Add Objective</button>
</div>

{/* Course Sections */}
<div className="col-span-2 mt-4">
  <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
    Course Sections
    <InfoTooltip text="Structured sections shown under 'Course Sections' heading" />
  </label>
  {courseSections.map((section, sIndex) => (
    <div key={sIndex} className="border p-4 rounded-lg mb-4">
      <input
        value={section.title}
        onChange={(e) => updateSectionTitle(sIndex, e.target.value)}
        className="w-full px-3 py-2 border rounded-lg mb-2"
        placeholder="Section title (e.g., Introduction to Immigration Systems)"
      />
      <textarea
        value={section.description}
        onChange={(e) => updateSectionDescription(sIndex, e.target.value)}
        className="w-full px-3 py-2 border rounded-lg mb-2 h-20"
        placeholder="Section description (optional)"
      />
      {section.topics.map((topic, tIndex) => (
        <div key={tIndex} className="flex gap-2 mb-2 ml-4">
          <input
            value={topic}
            onChange={(e) => updateSectionTopic(sIndex, tIndex, e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg"
            placeholder="e.g., Overview of immigration categories"
          />
          <button onClick={() => removeSectionTopic(sIndex, tIndex)}>Delete</button>
        </div>
      ))}
      <button onClick={() => addSectionTopic(sIndex)}>+ Add Topic</button>
      <button onClick={() => removeSection(sIndex)} className="ml-4">Delete Section</button>
    </div>
  ))}
  <button onClick={addSection}>+ Add Section</button>
</div>

{/* Image Uploads */}
<div className="col-span-1 mt-4">
  <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
    Thumbnail Image
    <InfoTooltip text="Small image shown on course cards in Explore Courses" />
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={handleThumbnailUpload}
    className="w-full"
  />
  {thumbnail && <img src={thumbnail} alt="Thumbnail preview" className="mt-2 w-32 h-32 object-cover" />}
</div>

<div className="col-span-1 mt-4">
  <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
    Cover Image
    <InfoTooltip text="Large header image on course overview page" />
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={handleCoverImageUpload}
    className="w-full"
  />
  {coverImage && <img src={coverImage} alt="Cover preview" className="mt-2 w-full h-48 object-cover" />}
</div>
```

#### B. InfoTooltip Component
Create a reusable tooltip component:

```jsx
// components/Admin/Shared/InfoTooltip.jsx
import { HelpCircle } from "lucide-react";
import { useState } from "react";

export const InfoTooltip = ({ text }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <HelpCircle
        size={16}
        className="text-blue-500 cursor-help"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};
```

### 3. Frontend Course Overview Update

Update CourseOverviewTab.jsx to fetch and display dynamic data:

```jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { programAPI } from "../../services/api.service";
import toast from "react-hot-toast";

const CourseOverviewTab = () => {
  const { id } = useParams(); // Get program ID from URL
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgramDetails();
  }, [id]);

  const fetchProgramDetails = async () => {
    try {
      const response = await programAPI.getById(id);
      if (response.success) {
        setProgram(response.data);
      }
    } catch (error) {
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading course details...</div>;
  if (!program) return <div>Course not found</div>;

  return (
    <div className="p-6">
      {/* Header with Cover Image */}
      {program.coverImage && (
        <img src={program.coverImage} alt={program.name} className="w-full h-64 object-cover rounded-lg mb-6" />
      )}

      {/* Title */}
      <h1 className="text-2xl font-bold text-secondary mb-6">
        {program.category} {program.name}
      </h1>

      {/* Course Description */}
      <div className="mb-8">
        <h2 className="font-semibold text-light mb-4">Course Description</h2>
        <div className="text-light whitespace-pre-wrap">
          {program.overview || "No description available"}
        </div>
      </div>

      {/* Topics Covered */}
      {program.topicsCovered && program.topicsCovered.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold mb-4">Topics include:</h2>
          <ul className="space-y-2">
            {program.topicsCovered.map((topic, index) => (
              <li key={index}>• {topic}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Learning Objectives */}
      {program.learningObjectives && program.learningObjectives.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold mb-4">What You'll Learn:</h2>
          <ul className="space-y-2">
            {program.learningObjectives.map((objective, index) => (
              <li key={index}>✓ {objective}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Course Sections */}
      {program.courseSections && program.courseSections.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">📚 Course Sections</h2>
          <div className="space-y-6">
            {program.courseSections
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {index + 1}. {section.title}
                  </h3>
                  {section.description && (
                    <p className="text-gray-700 mb-2">{section.description}</p>
                  )}
                  {section.topics && section.topics.length > 0 && (
                    <ul className="text-light space-y-1 ml-8">
                      {section.topics.map((topic, tIndex) => (
                        <li key={tIndex}>• {topic}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Documentation */}
      {program.documentation && program.documentation.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">📄 Course Materials</h2>
          <div className="grid gap-4">
            {program.documentation.map((doc, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{doc.title}</h3>
                {doc.content && <p className="text-sm text-gray-600 mt-2">{doc.content}</p>}
                {doc.fileUrl && (
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 inline-block">
                    Download {doc.type}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseOverviewTab;
```

### 4. Update AllPrograms to use thumbnails

```jsx
// In AllPrograms.jsx, replace the bgImage with:
const cardImage = program.thumbnail || getCategoryImage(program.category, index);

// Then use it:
<img src={cardImage} className="mx-auto" alt={program.name} />
```

## Implementation Steps

1. ✅ **Backend Model Updated** - Program.model.js now has all necessary fields
2. **Update Document.jsx** - Add new state variables and input fields for:
   - overview
   - topicsCovered (array)
   - learningObjectives (array)
   - courseSections (array of objects)
   - thumbnail upload
   - coverImage upload
3. **Create InfoTooltip Component** - Reusable ? icon with hover tooltip
4. **Update CourseOverviewTab.jsx** - Fetch program by ID and display all dynamic fields
5. **Update AllPrograms.jsx** - Use program.thumbnail instead of static images
6. **Update programController.js** - Ensure all new fields are in allowedKeys array for updates
7. **Test End-to-End**:
   - Create course in admin
   - Fill all new fields
   - Upload images
   - Save
   - View in Explore Courses
   - Check course overview page

## Key Points

- All content now comes from database
- Admin has full control over course presentation  
- Tooltips guide admins on where content appears
- Images are uploaded and stored
- Documentation/resources are dynamically rendered
- No static content remains

## Files to Modify

1. `/backend/models/Program.model.js` ✅ DONE
2. `/backend/front-end/src/components/Admin/Quizz/Document.jsx` - Add new fields
3. `/backend/front-end/src/components/Admin/Shared/InfoTooltip.jsx` - NEW FILE
4. `/backend/front-end/src/Pages/Overview/CourseOverviewTab.jsx` - Make dynamic
5. `/backend/front-end/src/components/Shared/AllPrograms.jsx` - Use thumbnails
6. `/backend/controllers/programController.js` - Add new fields to allowedKeys
