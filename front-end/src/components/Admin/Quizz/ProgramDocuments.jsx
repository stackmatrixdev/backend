import { useState, useEffect } from "react";
import {
  Upload,
  Link as LinkIcon,
  Trash2,
  FileText,
  Video,
  Youtube,
  FileSpreadsheet,
  ExternalLink,
  Lock,
  Unlock,
} from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../services/api.service";

export const ProgramDocuments = ({ programId }) => {
  const [activeTier, setActiveTier] = useState("free"); // 'free' or 'premium'
  const [uploadType, setUploadType] = useState("pdf"); // 'pdf', 'video', 'youtube', 'google-slides', 'link'
  const [documents, setDocuments] = useState({ free: [], premium: [] });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    externalUrl: "",
  });

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // Get token from auth object in localStorage
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = authData.accessToken || authData.access;

      const response = await fetch(
        `${API_BASE_URL}/programs/${programId}/documents`,
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
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (programId) {
      fetchDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleUpload = async () => {
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

      console.log("📤 [ProgramDocuments] ===== UPLOAD START =====");
      console.log("📤 [ProgramDocuments] Program ID:", programId);
      console.log("📤 [ProgramDocuments] Tier:", activeTier);
      console.log("📤 [ProgramDocuments] Type:", uploadType);
      console.log("📤 [ProgramDocuments] Title:", formData.title);

      const uploadFormData = new FormData();

      uploadFormData.append("tier", activeTier);
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description || "");
      uploadFormData.append("type", uploadType);

      if (uploadType === "pdf" || uploadType === "video") {
        uploadFormData.append("document", formData.file);
        console.log("📎 [ProgramDocuments] File:", formData.file?.name);
      } else {
        uploadFormData.append("externalUrl", formData.externalUrl);
        console.log("🔗 [ProgramDocuments] URL:", formData.externalUrl);
      }

      const url = `${API_BASE_URL}/programs/${programId}/documents`;
      console.log("📤 [ProgramDocuments] Sending to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      console.log("📥 [ProgramDocuments] Response status:", response.status);
      console.log("📥 [ProgramDocuments] Response data:", data);
      console.log("📤 [ProgramDocuments] ===== UPLOAD END =====");

      if (data.success) {
        toast.success(`Document added to ${activeTier} tier successfully!`);

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

        // Refresh documents
        fetchDocuments();
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
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      // Get token from auth object in localStorage
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = authData.accessToken || authData.access;

      const response = await fetch(
        `${API_BASE_URL}/programs/${programId}/documents/${documentId}?tier=${tier}`,
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
        fetchDocuments();
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
        return <FileText className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      case "google-slides":
        return <FileSpreadsheet className="w-5 h-5" />;
      case "link":
        return <ExternalLink className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const renderDocumentList = (docs, tier) => {
    if (docs.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p>No {tier} documents uploaded yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {docs.map((doc) => (
          <div
            key={doc._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="text-blue-500">{getFileIcon(doc.type)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {doc.title}
                </h4>
                {doc.description && (
                  <p className="text-sm text-gray-500 truncate">
                    {doc.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span className="capitalize">{doc.type}</span>
                  {doc.fileName && <span>{doc.fileName}</span>}
                  {doc.fileSize && <span>{formatFileSize(doc.fileSize)}</span>}
                  <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(doc._id, tier)}
              className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  if (!programId) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500 text-center">
          Please create a program first to upload documents
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Program Documents</h2>

      {/* Tier Selection */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTier("free")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeTier === "free"
              ? "bg-green-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Unlock className="w-5 h-5" />
          Free Documents
        </button>
        <button
          onClick={() => setActiveTier("premium")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeTier === "premium"
              ? "bg-yellow-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Lock className="w-5 h-5" />
          Premium Documents
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
        <h3 className="font-medium text-lg mb-4">
          Upload {activeTier === "free" ? "Free" : "Premium"} Document
        </h3>

        {/* Document Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button
              onClick={() => setUploadType("pdf")}
              className={`p-3 rounded-lg border-2 transition-all ${
                uploadType === "pdf"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FileText className="w-6 h-6 mx-auto mb-1" />
              <span className="text-xs font-medium">PDF</span>
            </button>
            <button
              onClick={() => setUploadType("video")}
              className={`p-3 rounded-lg border-2 transition-all ${
                uploadType === "video"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Video className="w-6 h-6 mx-auto mb-1" />
              <span className="text-xs font-medium">Video</span>
            </button>
            <button
              onClick={() => setUploadType("youtube")}
              className={`p-3 rounded-lg border-2 transition-all ${
                uploadType === "youtube"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Youtube className="w-6 h-6 mx-auto mb-1" />
              <span className="text-xs font-medium">YouTube</span>
            </button>
            <button
              onClick={() => setUploadType("google-slides")}
              className={`p-3 rounded-lg border-2 transition-all ${
                uploadType === "google-slides"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FileSpreadsheet className="w-6 h-6 mx-auto mb-1" />
              <span className="text-xs font-medium">Slides</span>
            </button>
            <button
              onClick={() => setUploadType("link")}
              className={`p-3 rounded-lg border-2 transition-all ${
                uploadType === "link"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <ExternalLink className="w-6 h-6 mx-auto mb-1" />
              <span className="text-xs font-medium">Link</span>
            </button>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter description (optional)"
          />
        </div>

        {/* File Upload or URL Input */}
        {uploadType === "pdf" || uploadType === "video" ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                onChange={handleFileChange}
                accept={uploadType === "pdf" ? ".pdf" : "video/*"}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.file && (
                <div className="text-sm text-gray-600">
                  {formData.file.name} ({formatFileSize(formData.file.size)})
                </div>
              )}
            </div>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </div>

      {/* Documents List */}
      <div className="mt-8">
        <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
          {activeTier === "free" ? (
            <>
              <Unlock className="w-5 h-5 text-green-500" />
              <span>Free Documents</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 text-yellow-500" />
              <span>Premium Documents</span>
            </>
          )}
        </h3>

        {loading ? (
          <div className="text-center py-8 text-gray-400">
            Loading documents...
          </div>
        ) : (
          renderDocumentList(
            activeTier === "free" ? documents.free : documents.premium,
            activeTier
          )
        )}
      </div>
    </div>
  );
};
