import {
  Upload,
  Trash2,
  FileText,
  Video,
  Youtube,
  FileSpreadsheet,
  ExternalLink,
  Lock,
  Unlock,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../services/api.service";
import { useTrainingCreation } from "../../../hooks/useTrainingCreation";

export const Document = ({ programId = null }) => {
  const { state } = useTrainingCreation();
  const [activeTier, setActiveTier] = useState("free"); // 'free' or 'premium'
  const [uploadType, setUploadType] = useState("pdf"); // 'pdf', 'video', 'youtube', 'google-slides', 'link'
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState({ free: [], premium: [] });

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    externalUrl: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  // Fetch existing documents when component mounts or programId changes
  useEffect(() => {
    const fetchDocuments = async () => {
      const currentProgramId = programId || state.creation.createdProgramId;

      if (!currentProgramId) return;

      setLoading(true);
      try {
        // Get token from auth object in localStorage
        const authData = JSON.parse(localStorage.getItem("auth") || "{}");
        const token = authData.accessToken || authData.access;

        const response = await fetch(
          `${API_BASE_URL}/programs/${currentProgramId}/documents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          setDocuments({
            free: data.data.free || [],
            premium: data.data.premium || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [programId, state.creation.createdProgramId]);

  const handleUpload = async () => {
    // Get the programId from context or props
    const currentProgramId = programId || state.creation.createdProgramId;

    if (!currentProgramId) {
      toast.error(
        "Please create the training first before uploading documents"
      );
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if ((uploadType === "pdf" || uploadType === "video") && !formData.file) {
      toast.error("Please select a file");
      return;
    }

    if (
      (uploadType === "youtube" ||
        uploadType === "google-slides" ||
        uploadType === "link") &&
      !formData.externalUrl.trim()
    ) {
      toast.error("Please enter a URL");
      return;
    }

    setUploading(true);
    try {
      // Get token from auth object in localStorage
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = authData.accessToken || authData.access;

      console.log(
        "🔐 [Document Upload] Token from localStorage:",
        token ? "Present" : "Missing"
      );

      if (!token) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      const uploadFormData = new FormData();

      uploadFormData.append("tier", activeTier);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description || "");
      uploadFormData.append("type", uploadType);

      if (uploadType === "pdf" || uploadType === "video") {
        uploadFormData.append("document", formData.file);
        console.log("📎 [Document Upload] File attached:", formData.file.name);
      } else {
        uploadFormData.append("externalUrl", formData.externalUrl);
        console.log("🔗 [Document Upload] External URL:", formData.externalUrl);
      }

      console.log(
        "📤 [Document Upload] Sending request to:",
        `${API_BASE_URL}/programs/${currentProgramId}/documents`
      );

      const response = await fetch(
        `${API_BASE_URL}/programs/${currentProgramId}/documents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadFormData,
        }
      );

      const data = await response.json();

      console.log("📥 [Document Upload] Response status:", response.status);
      console.log("📥 [Document Upload] Response data:", data);

      if (data.success) {
        toast.success(`Document added to ${activeTier} section successfully!`);

        // Add to local state
        const newDoc = {
          _id: data.data._id,
          title: formData.title,
          description: formData.description,
          type: uploadType,
          fileUrl: data.data.fileUrl,
          externalUrl: formData.externalUrl,
          fileName: formData.file?.name,
          fileSize: formData.file?.size,
          uploadedAt: new Date().toISOString(),
        };

        setDocuments((prev) => ({
          ...prev,
          [activeTier]: [...prev[activeTier], newDoc],
        }));

        // Reset form
        setFormData({
          title: "",
          description: "",
          file: null,
          externalUrl: "",
        });

        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      } else {
        toast.error(data.message || "Failed to upload document");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId, tier) => {
    const currentProgramId = programId || state.creation.createdProgramId;

    if (!currentProgramId) {
      toast.error("Program ID not found");
      return;
    }

    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      // Get token from auth object in localStorage
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = authData.accessToken || authData.access;

      const response = await fetch(
        `${API_BASE_URL}/programs/${currentProgramId}/documents/${documentId}?tier=${tier}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Document deleted successfully");
        setDocuments((prev) => ({
          ...prev,
          [tier]: prev[tier].filter((doc) => doc._id !== documentId),
        }));
      } else {
        toast.error(data.message || "Failed to delete document");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete document");
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "video":
        return <Video className="w-5 h-5 text-purple-500" />;
      case "youtube":
        return <Youtube className="w-5 h-5 text-red-600" />;
      case "google-slides":
        return <FileSpreadsheet className="w-5 h-5 text-yellow-500" />;
      case "link":
        return <ExternalLink className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const renderDocumentList = (docs, tier) => {
    if (docs.length === 0) {
      return (
        <div className="text-center py-6 text-gray-400 text-sm">
          <p>No {tier} documents uploaded yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {docs.map((doc) => (
          <div
            key={doc._id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate text-sm">
                  {doc.title}
                </h4>
                {doc.description && (
                  <p className="text-xs text-gray-500 truncate">
                    {doc.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span className="capitalize">{doc.type}</span>
                  {doc.fileName && (
                    <span className="truncate">{doc.fileName}</span>
                  )}
                  {doc.fileSize && <span>{formatFileSize(doc.fileSize)}</span>}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(doc._id, tier)}
              className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              title="Delete document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-md">
      {/* Header */}
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          📚 Manage Training Documents
        </h1>
        <p className="text-gray-600">
          Organize your course materials by uploading free and premium content.
          Free content is accessible to all users, while premium content
          requires a paid subscription.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading documents...</span>
        </div>
      ) : (
        <>
          {/* Tier Selection */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTier("free")}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                activeTier === "free"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
              }`}
            >
              <Unlock className="w-5 h-5" />
              <div className="text-left">
                <div className="text-lg">Free Files</div>
                <div
                  className={`text-sm ${
                    activeTier === "free" ? "text-green-100" : "text-gray-500"
                  }`}
                >
                  {documents.free.length} documents
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTier("premium")}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                activeTier === "premium"
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
              }`}
            >
              <Lock className="w-5 h-5" />
              <div className="text-left">
                <div className="text-lg">Premium Files</div>
                <div
                  className={`text-sm ${
                    activeTier === "premium"
                      ? "text-yellow-100"
                      : "text-gray-500"
                  }`}
                >
                  {documents.premium.length} documents
                </div>
              </div>
            </button>
          </div>

          {/* Upload Section */}
          <div
            className={`border-2 rounded-xl p-6 mb-8 ${
              activeTier === "free"
                ? "border-green-200 bg-green-50"
                : "border-yellow-200 bg-yellow-50"
            }`}
          >
            <div className="flex items-center gap-2 mb-5">
              {activeTier === "free" ? (
                <>
                  <Unlock className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-900">
                    Upload to Free Files Section
                  </h3>
                </>
              ) : (
                <>
                  <Lock className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-orange-900">
                    Upload to Premium Files Section
                  </h3>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-5">
              {activeTier === "free"
                ? "Free content will be accessible to all users without payment."
                : "Premium content requires users to have an active subscription."}
            </p>
            <button
              onClick={() => setActiveTier("free")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all text-sm ${
                activeTier === "free"
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Unlock className="w-4 h-4" />
              Free Files
            </button>
            <button
              onClick={() => setActiveTier("premium")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all text-sm ${
                activeTier === "premium"
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Lock className="w-4 h-4" />
              Premium Files
            </button>
          </div>

          {/* Upload Section */}
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg mb-6">
            <h3 className="font-medium text-base mb-4 text-gray-900">
              Upload to {activeTier === "free" ? "Free Files" : "Premium Files"}
            </h3>{" "}
            {/* Document Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type *
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { type: "pdf", icon: FileText, label: "PDF" },
                  { type: "video", icon: Video, label: "Video" },
                  { type: "youtube", icon: Youtube, label: "YouTube" },
                  {
                    type: "google-slides",
                    icon: FileSpreadsheet,
                    label: "Slides",
                  },
                  { type: "link", icon: ExternalLink, label: "Link" },
                ].map(({ type, icon: IconComponent, label }) => (
                  <button
                    key={type}
                    onClick={() => setUploadType(type)}
                    className={`p-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
                      uploadType === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mx-auto mb-1" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter document title"
              />
            </div>
            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter description (optional)"
              />
            </div>
            {/* File Upload or URL Input */}
            {uploadType === "pdf" || uploadType === "video" ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File *
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={uploadType === "pdf" ? ".pdf" : "video/*"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                {formData.file && (
                  <p className="text-xs text-gray-600 mt-1">
                    {formData.file.name} ({formatFileSize(formData.file.size)})
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {uploadType === "youtube" && "YouTube URL *"}
                  {uploadType === "google-slides" && "Google Slides URL *"}
                  {uploadType === "link" && "External Link *"}
                </label>
                <input
                  type="url"
                  name="externalUrl"
                  value={formData.externalUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder={
                    uploadType === "youtube"
                      ? "https://www.youtube.com/watch?v=..."
                      : uploadType === "google-slides"
                      ? "https://docs.google.com/presentation/..."
                      : "https://example.com"
                  }
                />
              </div>
            )}
            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              <Upload className="w-4 h-4" />
              {uploading
                ? "Uploading..."
                : `Add to ${
                    activeTier === "free" ? "Free Files" : "Premium Files"
                  }`}
            </button>
          </div>

          {/* Uploaded Documents Display */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              📂 Uploaded Documents
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Free Documents Section */}
              <div className="border-2 border-green-200 rounded-xl p-5 bg-gradient-to-br from-green-50 to-white">
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-green-200">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-6 h-6 text-green-600" />
                    <h3 className="font-bold text-lg text-green-900">
                      Free Files
                    </h3>
                  </div>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {documents.free.length}
                  </span>
                </div>
                {renderDocumentList(documents.free, "free")}
              </div>

              {/* Premium Documents Section */}
              <div className="border-2 border-yellow-200 rounded-xl p-5 bg-gradient-to-br from-yellow-50 to-white">
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-yellow-200">
                  <div className="flex items-center gap-2">
                    <Lock className="w-6 h-6 text-orange-600" />
                    <h3 className="font-bold text-lg text-orange-900">
                      Premium Files
                    </h3>
                  </div>
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {documents.premium.length}
                  </span>
                </div>
                {renderDocumentList(documents.premium, "premium")}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Document;
