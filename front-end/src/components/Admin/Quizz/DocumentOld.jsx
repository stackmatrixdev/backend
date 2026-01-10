import { ChevronDown, Info } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  fileUploadAPI,
  programAPI,
  topicManagementAPI,
} from "../../../services/api.service";
import { useTrainingCreation } from "../../../hooks/useTrainingCreation";

export const Document = ({ programId = null }) => {
  const { state, actions } = useTrainingCreation();
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // File upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Dynamic data states
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fileInputRef = useRef(null);

  // Use shared state
  const documentTitle = state.basicInfo.quizTitle;
  const selectedTopic = state.basicInfo.topic;
  const selectedCategory = state.basicInfo.category;
  const document = state.basicInfo.description;
  const uploadedFiles = state.documents.files;

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("🔍 [Document] Fetching categories from API...");
        const response = await programAPI.getCategories();
        console.log("📦 [Document] Full categories response:", response);

        if (response.success && response.data.categories) {
          console.log(
            "✅ [Document] Categories loaded:",
            response.data.categories.length,
            "categories"
          );
          console.log(
            "📋 [Document] First category:",
            response.data.categories[0]
          );
          setCategories(response.data.categories);
        } else {
          console.warn("⚠️ [Document] Invalid response format:", response);
        }
      } catch (error) {
        console.error("❌ [Document] Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        console.log("🔍 [Document] Fetching topics from API...");
        const response = await topicManagementAPI.getAllTopics();
        console.log("📦 [Document] Full topics response:", response);

        if (response.success && response.data) {
          // Extract topic titles from the response (topics are objects with title field)
          const topicTitles = response.data.map((topic) => topic.title);
          console.log(
            "✅ [Document] Topics loaded:",
            topicTitles.length,
            "topics"
          );
          console.log("📋 [Document] Topic titles:", topicTitles);
          setTopics(topicTitles);
        } else {
          console.warn("⚠️ [Document] Invalid response format:", response);
        }
      } catch (error) {
        console.error("❌ [Document] Failed to fetch topics:", error);
        toast.error("Failed to load topics");
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, []);

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle file select
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    if (!programId) {
      // For now, just add to local state if no programId
      const fileWithId = {
        ...selectedFile,
        id: Date.now(),
        uploaded: false,
        url: null,
      };
      actions.addDocument(fileWithId);
      setSelectedFile(null);
      toast.success("File added to queue");
      return;
    }

    setUploading(true);
    try {
      const metadata = {
        title: documentTitle,
        topic: selectedTopic,
        category: selectedCategory,
        description: document,
      };

      const response = await fileUploadAPI.uploadDocument(
        selectedFile,
        programId,
        metadata
      );

      if (response.success) {
        const uploadedFile = {
          ...selectedFile,
          id: response.data.id,
          uploaded: true,
          url: response.data.url,
        };
        actions.addDocument(uploadedFile);
        setSelectedFile(null);
        toast.success("File uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // Handle delete (with confirmation modal)
  const deleteFile = async (index) => {
    const file = uploadedFiles[index];

    // If file was uploaded to server, delete it
    if (file.uploaded && file.id) {
      try {
        await fileUploadAPI.deleteFile(file.id);
        toast.success("File deleted from server");
      } catch (error) {
        console.error("Failed to delete file from server:", error);
        toast.error("Failed to delete file from server");
      }
    }

    setConfirmDeleteIndex(index);
  };

  const confirmDelete = () => {
    actions.removeDocument(confirmDeleteIndex);
    setConfirmDeleteIndex(null);
    toast.success("File removed from list");
  };

  const cancelDelete = () => {
    setConfirmDeleteIndex(null);
  };

  // Handle Save (create program with documents)
  const handleSave = async () => {
    // Use programId from props or context
    const currentProgramId = programId || state.creation.createdProgramId;

    // Validation: check if required fields are filled
    if (!documentTitle.trim()) {
      toast.error("Please enter a document title");
      return;
    }

    if (!selectedTopic.trim()) {
      toast.error("Please select a topic");
      return;
    }

    if (!selectedCategory.trim()) {
      toast.error("Please select a category");
      return;
    }

    if (!document.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    setSaving(true);
    try {
      console.log("💾 [Document] Saving with program ID:", currentProgramId);
      console.log("📄 [Document] Uploaded files:", uploadedFiles);

      if (currentProgramId) {
        // Update existing program with documents
        const updateData = {
          documentation: uploadedFiles
            .filter((file) => file && file.name) // Filter out invalid files
            .map((file) => ({
              title: file.name || "Untitled Document",
              content: document,
              fileUrl: file.url || file.path || null,
              type: getFileType(file.name),
            })),
        };

        console.log("🔄 [Document] Updating program with:", updateData);
        const response = await programAPI.update(currentProgramId, updateData);

        console.log("📦 [Document] Update response:", response);

        if (response.success) {
          toast.success("Documents added to program successfully!");
          console.log("✅ [Document] Program updated");
        } else {
          toast.error(response.message || "Failed to update program");
        }
      } else {
        // Create new program with documents only
        const newProgramData = {
          title: documentTitle,
          topic: selectedTopic,
          category: selectedCategory,
          description: document,
          documents: uploadedFiles
            .filter((file) => file && file.name) // Filter out invalid files
            .map((file) => ({
              title: file.name || "Untitled Document",
              content: document,
              fileUrl: file.url || file.path || null,
              type: getFileType(file.name),
            })),
        };

        console.log("➕ [Document] Creating new program with:", newProgramData);
        const response = await programAPI.create(newProgramData);

        console.log("📦 [Document] Create response:", response);

        if (response.success) {
          toast.success("Program created successfully!");
          console.log("✅ [Document] Program created");

          // Store the created program ID
          if (response.data && response.data._id) {
            actions.setCreatedProgramId(response.data._id);
          }
        } else {
          toast.error(response.message || "Failed to create program");
        }
      }
    } catch (error) {
      console.error("❌ [Document] Save failed:", error);
      console.error("❌ [Document] Error details:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save program";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Helper function to determine file type
  const getFileType = (filename) => {
    // Handle undefined or null filename
    if (!filename || typeof filename !== "string") {
      console.warn("⚠️ [Document] Invalid filename:", filename);
      return "text";
    }

    const extension = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(extension)) return "pdf";
    if (["doc", "docx"].includes(extension)) return "doc";
    if (["mp4", "avi", "mov"].includes(extension)) return "video";
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    return "text";
  };

  return (
    <div className="bg-white p-6 rounded-md">
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-1">
          <Info size={20} color="#1E90FF" />
          <h1 className="text-base font-medium text-black">Documents Upload</h1>
        </div>
        <p className="text-gray-600 ml-8 font-normal text-xs">
          Set up the fundamental details of your quiz
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-extralight text-black mb-2">
            Documents title
          </label>
          <input
            type="text"
            value={documentTitle}
            onChange={(e) =>
              actions.updateBasicInfo({ quizTitle: e.target.value })
            }
            className="w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder=""
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <label className="block text-sm font-extralight text-black mb-2">
            Category *
          </label>
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            disabled={loadingCategories}
            className="w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className={selectedCategory ? "text-gray-900" : "text-gray-400"}
            >
              {loadingCategories
                ? "Loading categories..."
                : selectedCategory || "Select category..."}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                showCategoryDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#BCBCBC] rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto">
              {(() => {
                console.log(
                  "📋 [Document] Rendering category dropdown. Categories:",
                  categories
                );
                console.log(
                  "📊 [Document] Categories length:",
                  categories.length
                );
                return categories.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No categories available
                  </div>
                ) : (
                  categories.map((categoryItem, index) => {
                    console.log(
                      "🔹 [Document] Rendering category:",
                      categoryItem
                    );
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          console.log(
                            "✅ [Document] Selected category:",
                            categoryItem
                          );
                          actions.updateBasicInfo({ category: categoryItem });
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors text-sm"
                      >
                        {categoryItem}
                      </button>
                    );
                  })
                );
              })()}
            </div>
          )}
        </div>

        {/* Topic Dropdown */}
        <div className="relative">
          <label className="block text-sm font-extralight text-black mb-2">
            Topic *
          </label>
          <button
            type="button"
            onClick={() => setShowTopicDropdown(!showTopicDropdown)}
            disabled={loadingTopics}
            className="w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={selectedTopic ? "text-gray-900" : "text-gray-400"}>
              {loadingTopics
                ? "Loading topics..."
                : selectedTopic || "Select topic..."}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                showTopicDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showTopicDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#BCBCBC] rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto">
              {(() => {
                console.log(
                  "📋 [Document] Rendering topic dropdown. Topics:",
                  topics
                );
                console.log("📊 [Document] Topics length:", topics.length);
                return topics.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No topics available
                  </div>
                ) : (
                  topics.map((topicItem, index) => {
                    console.log("🔹 [Document] Rendering topic:", topicItem);
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          console.log(
                            "✅ [Document] Selected topic:",
                            topicItem
                          );
                          actions.updateBasicInfo({ topic: topicItem });
                          setShowTopicDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors text-sm"
                      >
                        {topicItem}
                      </button>
                    );
                  })
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Upload Documents Section */}
      <div className="mt-2 bg-gray-50 rounded-lg py-6">
        <h4 className="text-base font-medium text-black mb-4">
          Upload Documents
        </h4>
        <div className="flex items-center relative">
          {/* Hidden input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleButtonClick}
            className="bg-blue-500 hover:bg-blue-600 rounded-md text-white w-32 h-10 py-2 font-medium absolute top-2"
          >
            Choose File
          </button>
          <div className="text-sm text-[#000] border border-[#BCBCBC] rounded-md w-full h-10 bg-white pl-36 mt-2 pt-2.5">
            {selectedFile ? selectedFile.name : "No file chosen"}
          </div>
        </div>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full bg-gradient-to-r from-[#189EFE] to-[#0E5F98] text-white py-2 px-4 rounded-lg text-base font-medium mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Uploaded Documents List */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg p-6 mt-4">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              Uploaded Documents
            </h3>
          </div>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-[#DBDBDB] bg-white p-4 rounded-md"
              >
                <span className="text-base text-black">{file.name}</span>
                <button
                  onClick={() => deleteFile(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Information */}
      <div className="mt-2">
        <label className="block text-sm font-extralight text-black mb-2">
          Document Information
        </label>
        <textarea
          value={document}
          onChange={(e) =>
            actions.updateBasicInfo({ description: e.target.value })
          }
          rows={4}
          className="w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          placeholder=""
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-center mt-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-80 bg-gradient-to-r from-[#189EFE] to-[#0E5F98] text-white text-base py-2 px-4 rounded-lg font-normal transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to delete this file?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
