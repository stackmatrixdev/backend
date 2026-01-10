import React, { useState, useEffect } from "react";
import {
  Lock,
  FileText,
  Video,
  PlayCircle,
  Link as LinkIcon,
  FileImage,
} from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { programAPI } from "../../services/api.service";
import SubscriptionPopup from "../../components/SubscriptionPopup";

const Documentation = () => {
  const { id } = useParams();
  const [documents, setDocuments] = useState({ free: [], premium: [] });
  const [loading, setLoading] = useState(true);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Helper function to get icon based on file type
  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-500" />;
      case "video":
        return <Video className="w-6 h-6 text-purple-500" />;
      case "youtube":
        return <PlayCircle className="w-6 h-6 text-red-600" />;
      case "google-slides":
        return <FileImage className="w-6 h-6 text-yellow-500" />;
      case "link":
        return <LinkIcon className="w-6 h-6 text-blue-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await programAPI.getDocuments(id);

        if (data.success) {
          setDocuments({
            free: data.data.free || [],
            premium: data.data.premium || [],
          });

          setIsPremiumUnlocked(data.data.hasPremiumAccess || false);

          // Auto-select first free document
          if (data.data.free && data.data.free.length > 0) {
            setSelectedDoc(data.data.free[0]);
          }
        } else {
          toast.error(data.message || "Failed to load documents");
        }
      } catch (error) {
        console.error("❌ [Documentation] Fetch error:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
        } else {
          toast.error("Failed to load documents");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [id]);

  // Get unique premium content types for locked section
  const getPremiumContentTypes = () => {
    const types = new Set();
    documents.premium.forEach((doc) => {
      types.add(doc.type);
    });
    return Array.from(types);
  };

  const handleDocumentClick = (doc, isPremium = false) => {
    // Prevent viewing premium content without subscription
    if (isPremium && !isPremiumUnlocked) {
      setShowSubscriptionPopup(true);
      return;
    }

    // Mark the document with its premium status
    setSelectedDoc({ ...doc, isPremium: isPremium });
  };

  const handlePremiumSectionClick = () => {
    setShowSubscriptionPopup(true);
  };

  const renderDocumentContent = (doc) => {
    if (!doc) return null;

    // ONLY block if this is explicitly marked as premium AND user doesn't have access
    if (doc.isPremium === true && !isPremiumUnlocked) {
      return (
        <div className="w-full rounded-lg border-2 border-dashed border-red-300 bg-red-50 p-12 text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Premium Content Locked
          </h3>
          <p className="text-gray-700 mb-6">
            This content is only available for premium subscribers.
          </p>
          <button
            onClick={handlePremiumSectionClick}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all"
          >
            🔓 Unlock Premium Access
          </button>
        </div>
      );
    }

    const content = doc.externalUrl || doc.fileUrl;

    switch (doc.type) {
      case "pdf": {
        const pdfUrl = content.startsWith("http")
          ? content
          : `http://localhost:5000${content}`;

        return (
          <div className="w-full rounded-lg overflow-hidden shadow-lg bg-gray-100">
            {/* Direct PDF embed using object tag */}
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="700px"
              className="rounded-lg"
            >
              {/* Fallback: Google Docs Viewer */}
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  pdfUrl
                )}&embedded=true`}
                width="100%"
                height="700px"
                title="PDF Viewer"
                className="rounded-lg"
              ></iframe>
            </object>
            {/* Download link as backup */}
            <div className="p-2 bg-white border-t border-gray-200 text-center">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                📄 Open PDF in New Tab
              </a>
            </div>
          </div>
        );
      }

      case "google-slides":
        return (
          <div className="w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={content}
              width="100%"
              height="600px"
              frameBorder="0"
              title="Google Slides"
              allow="fullscreen"
              allowFullScreen
            ></iframe>
          </div>
        );

      case "youtube":
        return (
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="500px"
              src={
                content.includes("youtube.com") || content.includes("youtu.be")
                  ? content
                      .replace("watch?v=", "embed/")
                      .replace("youtu.be/", "youtube.com/embed/")
                  : content
              }
              frameBorder="0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        );

      case "video": {
        if (!content.includes("youtube")) {
          const videoUrl = content.startsWith("http")
            ? content
            : `http://localhost:5000${content}`;

          return (
            <div className="rounded-lg overflow-hidden shadow-lg">
              <video width="100%" height="500px" controls className="w-full">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }
        break;
      }

      case "link":
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              This lesson links to an external resource:
            </p>
            <a
              href={content}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open Resource
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        );

      default:
        return <p className="text-gray-600">Content type not supported.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 min-h-screen">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 bg-white border-r border-gray-200 shadow-lg">
            <div className="sticky top-0 max-h-screen overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-700 to-blue-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Course Materials
                </h2>
              </div>

              {/* Free Content List */}
              {documents.free.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Free Access
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {documents.free.map((doc, index) => (
                      <div
                        key={index}
                        onClick={() => handleDocumentClick(doc, false)}
                        className={`group cursor-pointer rounded-lg p-3 transition-all ${
                          selectedDoc?._id === doc._id
                            ? "bg-blue-100 border-l-4 border-blue-700 shadow-md"
                            : "hover:bg-gray-50 border-l-4 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {getFileIcon(doc.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {doc.title}
                            </h4>
                            <span className="text-xs text-gray-500 capitalize">
                              {doc.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Premium Locked Section */}
              {documents.premium.length > 0 && !isPremiumUnlocked && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <Lock className="w-3 h-3 text-orange-600" />
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Premium Content
                    </h3>
                  </div>
                  <div
                    onClick={handlePremiumSectionClick}
                    className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg p-4 border-2 border-orange-400 cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-center mb-3">
                      <div className="bg-orange-200 p-3 rounded-full">
                        <Lock className="w-6 h-6 text-orange-700" />
                      </div>
                    </div>
                    <p className="text-sm text-center text-gray-700 font-medium mb-3">
                      {documents.premium.length} Premium{" "}
                      {documents.premium.length === 1
                        ? "Resource"
                        : "Resources"}
                    </p>

                    {/* Available Content Types Icons */}
                    <div className="flex justify-center gap-2 mb-3 flex-wrap">
                      {getPremiumContentTypes().map((type, index) => (
                        <div
                          key={index}
                          className="bg-white p-2 rounded-full shadow-sm"
                          title={type}
                        >
                          {getFileIcon(type)}
                        </div>
                      ))}
                    </div>

                    <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-xl transition-all">
                      🔓 Unlock Now
                    </button>
                  </div>

                  {/* Premium Items Preview */}
                  <div className="mt-3 space-y-2">
                    {documents.premium.slice(0, 3).map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg opacity-60"
                      >
                        <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-600 truncate">
                          {doc.title}
                        </span>
                      </div>
                    ))}
                    {documents.premium.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{documents.premium.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Premium Content List (If Unlocked) */}
              {documents.premium.length > 0 && isPremiumUnlocked && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Premium Access
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {documents.premium.map((doc, index) => (
                      <div
                        key={index}
                        onClick={() => handleDocumentClick(doc, true)}
                        className={`group cursor-pointer rounded-lg p-3 transition-all ${
                          selectedDoc?._id === doc._id
                            ? "bg-amber-100 border-l-4 border-amber-700 shadow-md"
                            : "hover:bg-gray-50 border-l-4 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {getFileIcon(doc.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {doc.title}
                            </h4>
                            <span className="text-xs text-gray-500 capitalize">
                              {doc.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Content */}
              {documents.free.length === 0 &&
                documents.premium.length === 0 && (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      No materials available yet
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 p-6 lg:p-8 overflow-y-auto">
            {selectedDoc ? (
              <div className="max-w-5xl mx-auto">
                {/* Document Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-600">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                        {getFileIcon(selectedDoc.type)}
                      </div>
                      <div className="flex-1">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                          {selectedDoc.title}
                        </h1>
                        {selectedDoc.description && (
                          <p className="text-gray-600 mb-3">
                            {selectedDoc.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              selectedDoc.isPremium === true
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {selectedDoc.isPremium === true
                              ? "Premium"
                              : "Free"}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium capitalize">
                            {selectedDoc.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Content */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {renderDocumentContent(selectedDoc)}
                </div>
              </div>
            ) : (
              /* Welcome Screen */
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg">
                    <FileText className="w-12 h-12 text-blue-500 mx-auto" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Welcome to Course Materials
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Select any document from the sidebar to start learning
                  </p>
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span>{documents.free.length} Free</span>
                    </div>
                    {documents.premium.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3 text-orange-600" />
                        <span>{documents.premium.length} Premium</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subscription Popup */}
      {showSubscriptionPopup && (
        <SubscriptionPopup
          programId={id}
          onClose={() => setShowSubscriptionPopup(false)}
        />
      )}
    </div>
  );
};

export default Documentation;
