import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { topicManagementAPI, programAPI, getImageUrl } from "../../../services/api.service";
import toast from "react-hot-toast";

const AdminTopics = ({ setShowAdminTopics, editingTopic = null }) => {
  const isEditMode = !!editingTopic;
  
  const [topicTitle, setTopicTitle] = useState(editingTopic?.title || "");
  const [description, setDescription] = useState(editingTopic?.description || "");
  const [freeQues, setFreeQues] = useState(editingTopic?.numberOfFreeQuestions?.toString() || "3");
  const [chatbotPrice, setChatbotPrice] = useState(editingTopic?.pricing?.chatbotPrice?.toString() || "0");
  const [documentationPrice, setDocumentationPrice] = useState(editingTopic?.pricing?.documentationPrice?.toString() || "0");
  const [examSimulatorPrice, setExamSimulatorPrice] = useState(editingTopic?.pricing?.examSimulatorPrice?.toString() || "0");
  const [bundlePrice, setBundlePrice] = useState(editingTopic?.pricing?.bundlePrice?.toString() || "0");
  const [overview, setOverview] = useState(editingTopic?.overview || "");
  const [courseImage, setCourseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    editingTopic?.coverImage ? getImageUrl(editingTopic.coverImage) : null
  );
  const [saving, setSaving] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState(editingTopic?.category || "");
  const [showDropdown, setShowDropdown] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  // Fetch categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await programAPI.getCategories();
        if (response.success && response.data && response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // only take the first file
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only image files (JPEG, PNG, GIF, WEBP) are allowed");
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setCourseImage(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setCourseImage(null);
      setImagePreview(null);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    setSavingCategory(true);
    try {
      const response = await programAPI.addCategory(newCategory.trim());

      if (response.success) {
        toast.success("Category created successfully!");

        // Add new category to local state
        setCategories(response.data.allCategories);

        // Select the newly created category
        setSelectedCategories(newCategory.trim());

        // Reset and close
        setNewCategory("");
        setAddingCategory(false);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create category";
      toast.error(errorMessage);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!topicTitle.trim()) {
      toast.error("Topic title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!selectedCategories) {
      toast.error("Please select a category");
      return;
    }
    if (!overview.trim()) {
      toast.error("Overview is required");
      return;
    }

    setSaving(true);
    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("title", topicTitle);
      formData.append("description", description);
      formData.append("category", selectedCategories);
      formData.append("numberOfFreeQuestions", parseInt(freeQues) || 3);
      formData.append("chatbotPrice", parseFloat(chatbotPrice) || 0);
      formData.append(
        "documentationPrice",
        parseFloat(documentationPrice) || 0
      );
      formData.append(
        "examSimulatorPrice",
        parseFloat(examSimulatorPrice) || 0
      );
      formData.append("bundlePrice", parseFloat(bundlePrice) || 0);
      formData.append("overview", overview);

      // Append course image if selected (new image uploaded)
      if (courseImage) {
        formData.append("courseImage", courseImage);
      }

      console.log(isEditMode ? "Updating topic with FormData" : "Creating topic with FormData");

      let response;
      if (isEditMode) {
        // Update existing topic
        response = await topicManagementAPI.updateTopic(editingTopic._id || editingTopic.id, formData);
        toast.success("Topic updated successfully!");
      } else {
        // Create new topic
        response = await topicManagementAPI.createTopic(formData);
        toast.success("Topic created successfully!");
      }

      if (response.success) {
        // Reset fields after successful creation/update
        setTopicTitle("");
        setDescription("");
        setExamSimulatorPrice("0");
        setBundlePrice("0");
        setFreeQues("3");
        setChatbotPrice("0");
        setDocumentationPrice("0");
        setOverview("");
        setCourseImage(null);
        setImagePreview(null);
        setSelectedCategories("");

        // Navigate back to list
        setShowAdminTopics(false);
      }
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} topic:`, error);
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} topic`);
    } finally {
      setSaving(false);
    }
  };

  const infoIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 32 32"
    >
      <path
        fill="none"
        d="M16 8a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 16 8m4 13.875h-2.875v-8H13v2.25h1.875v5.75H12v2.25h8Z"
      ></path>
      <path
        fill="#189EFE"
        d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 6a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 16 8m4 16.125h-8v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z"
      ></path>
    </svg>
  );

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "link",
    "image",
  ];

  return (
    <div className="bg-white rounded-md shadow-md w-full max-w-5xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-2">
          {infoIcon()}
          <h2 className="text-stone-600 text-base font-medium font-['Poppins']">
            {isEditMode ? "Edit Topic" : "Add Topics"}
          </h2>
        </div>
        <button
          onClick={() => setShowAdminTopics(false)}
          className="w-20 h-8 bg-gradient-to-r from-sky-500 to-sky-700 rounded-xl text-white text-base font-medium font-['Poppins'] flex items-center justify-center gap-1"
        >
          <ChevronLeft size={16} color="#ffffff" />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Topic Title */}
          <div>
            <label className="block mb-2.5 justify-start text-black text-sm font-medium font-['Poppins']">
              Topic Title *
            </label>
            <input
              type="text"
              value={topicTitle}
              onChange={(e) => setTopicTitle(e.target.value)}
              className="w-full px-3 py-2 h-10 bg-white rounded-[10px] border border-stone-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2.5 justify-start text-black text-sm font-medium font-['Poppins']">
              Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 h-10 bg-white rounded-[10px] border border-stone-300"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <label className="block mb-2.5 justify-start text-black text-sm font-medium font-['Poppins']">
              Category *
            </label>
            <div
              onClick={() =>
                !loadingCategories && setShowDropdown(!showDropdown)
              }
              className={`w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 
                   focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors 
                   bg-white text-left flex items-center justify-between cursor-pointer
                   ${loadingCategories ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={
                  selectedCategories ? "text-gray-900" : "text-gray-400"
                }
              >
                {loadingCategories
                  ? "Loading categories..."
                  : selectedCategories || "Select Category..."}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </div>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#BCBCBC] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {categories.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-gray-500">
                    No categories available from database.
                  </div>
                ) : (
                  categories.map((category, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSelectedCategories(category);
                        setShowDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                    >
                      {category}
                    </button>
                  ))
                )}

                {/* Add New Category Option */}
                <div className="border-t border-gray-200 p-2">
                  {!addingCategory ? (
                    <button
                      type="button"
                      onClick={() => setAddingCategory(true)}
                      className="w-full p-2 text-left text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium transition-colors"
                    >
                      + Create New Category
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleCreateCategory();
                          }
                        }}
                        className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter category name"
                        autoFocus
                        disabled={savingCategory}
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={savingCategory || !newCategory.trim()}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingCategory ? "..." : "✓"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewCategory("");
                          setAddingCategory(false);
                        }}
                        disabled={savingCategory}
                        className="bg-gray-300 text-black px-3 py-1.5 rounded-md text-xs hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Number of Free Questions */}
          <div>
            <label className="block mb-2.5 justify-start text-black text-sm font-medium font-['Poppins']">
              Number of Free Questions *
            </label>
            <input
              type="number"
              value={freeQues}
              onChange={(e) => setFreeQues(e.target.value)}
              className="w-full px-3 py-2 h-10 bg-white rounded-[10px] border border-stone-300"
            />
          </div>

          {/* Price for Chatbot */}
          <div>
            <label className="block mb-2.5 justify-start text-black text-sm font-medium font-['Poppins']">
              Price for Chatbot *
            </label>
            <input
              type="number"
              value={chatbotPrice}
              onChange={(e) => setChatbotPrice(e.target.value)}
              className="w-full px-3 py-2 h-10 bg-white rounded-[10px] border border-stone-300"
            />
          </div>

          {/* Price for Documentation */}
          <div>
            <label className="block mb-2.5 justify-start text-black text-sm font-medium font-['Poppins']">
              Price for Documentation *
            </label>
            <input
              type="number"
              value={documentationPrice}
              onChange={(e) => setDocumentationPrice(e.target.value)}
              className="w-full px-3 py-2 h-10 bg-white rounded-[10px] border border-stone-300"
            />
          </div>

          {/* Price for Exam Simulator */}
          <div>
            <label className="block mb-2.5 justify-start text-black text-sm font-medium font-['Poppins']">
              Price for Exam Simulator *
            </label>
            <input
              type="number"
              value={examSimulatorPrice}
              onChange={(e) => setExamSimulatorPrice(e.target.value)}
              className="w-full px-3 py-2 h-10 bg-white rounded-[10px] border border-stone-300"
            />
          </div>

          {/* Bundle Price */}
          <div>
            <label className="block mb-2.5 justify-start text-black text-sm font-medium font-['Poppins']">
              Bundle Price *
            </label>
            <input
              type="number"
              value={bundlePrice}
              onChange={(e) => setBundlePrice(e.target.value)}
              className="w-full px-3 py-2 h-10 bg-white rounded-[10px] border border-stone-300"
            />
          </div>
        </div>
        <div className="mt-14">
          <h1 className="justify-start text-black text-sm font-medium font-['Poppins'] mb-2">
            Overview
          </h1>
          {/* Overview & Upload */}
          <div className="w-full flex flex-col sm:flex-row gap-6">
            {/* Overview */}
            <div className="w-full sm:w-2/3">
              <ReactQuill
                theme="snow"
                value={overview}
                onChange={setOverview}
                modules={modules}
                formats={formats}
                className="bg-white rounded-[10px] [&_.ql-container]:h-[245px] [&_.ql-editor]:h-full [&_.ql-editor]:overflow-y-auto"
              />
            </div>

            {/* Upload */}
            <div className="w-full sm:w-1/3 h-72 bg-white rounded-[10px] border border-neutral-300 p-4 flex flex-col">
              <h3 className="text-lg font-medium mb-3 text-center">
                Upload Course Image
              </h3>
              <p className="text-xs text-gray-500 mb-3 text-center">
                Only one image file allowed (Max 5MB)
              </p>

              {/* Upload Box */}
              <div
                className={`rounded-md w-full flex-1 flex items-center justify-center relative
                ${
                  imagePreview
                    ? ""
                    : "border-2 border-dashed border-gray-300 p-8"
                }`}
              >
                {imagePreview ? (
                  <div className="w-full h-full relative group">
                    <img
                      src={imagePreview}
                      alt="Course preview"
                      className="w-full h-full object-contain rounded-md"
                    />
                    {/* Remove button overlay */}
                    <button
                      type="button"
                      onClick={() => {
                        setCourseImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Remove image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">
                      Drag & drop course image or
                    </p>
                    <label className="text-blue-600 cursor-pointer font-medium hover:text-blue-700">
                      Browse
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                      />
                    </label>
                    <p className="text-xs text-gray-400 mt-2">
                      Supported: JPG, PNG, GIF, WEBP
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-center items-center mt-7">
          <button
            type="submit"
            disabled={saving}
            className="px-14 py-2 bg-gradient-to-r from-sky-500 to-sky-700 rounded-xl justify-start text-white text-xl font-medium font-['Poppins'] leading-loose disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Topic" : "Save Topic")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminTopics;
