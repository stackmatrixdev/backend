import { useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FakeChatbot } from "./FakeChatbot";
import { useTrainingCreation } from "../../../../contexts/TrainingCreationContext";
import { quizManagementAPI } from "../../../../services/api.service";
import toast from "react-hot-toast";

export const GuidedQuesitons = () => {
  const { state, actions } = useTrainingCreation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Use context for basic info (shared with Exam Simulator)
  const { basicInfo } = state;

  // Use local state for guided questions specific data
  const [fakeChatbot, setFakeChatbot] = useState({
    quizTitle: basicInfo.quizTitle || "",
    topic: basicInfo.topic || "",
    category: basicInfo.category || "",
    freeAttempts: "3",
  });

  // Questions state
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "Which of the following is not a valid HTTP method?",
      answer: "FETCH",
    },
  ]);

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    answer: "",
  });

  // Upload states
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const addNewQuestion = () => {
    const newQ = {
      ...newQuestion,
      id: questions.length + 1,
    };
    setQuestions([...questions, newQ]);
    setNewQuestion({ text: "", answer: "" });
  };

  const isFormValid = () => {
    if (!newQuestion.text.trim() || !newQuestion.answer.trim()) return false;
    return true;
  };

  // Handle file choose
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      console.log("File selected:", e.target.files[0].name);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    // Safely get file extension
    const fileExtension = selectedFile.name
      ? selectedFile.name.split(".").pop()
      : "unknown";

    const newFile = {
      name: selectedFile.name || "Untitled File",
      type: fileExtension,
    };
    setUploadedFiles((prev) => [...prev, newFile]);
    setSelectedFile(null);
  };

  const deleteFile = (index) => {
    setDeleteType("file");
    setConfirmDeleteIndex(index);
  };

  const deleteQuestion = (id) => {
    setDeleteType("question");
    setConfirmDeleteIndex(id);
  };

  const confirmDelete = () => {
    if (deleteType === "file") {
      setUploadedFiles(
        uploadedFiles.filter((_, i) => i !== confirmDeleteIndex)
      );
    } else if (deleteType === "question") {
      setQuestions(questions.filter((q) => q.id !== confirmDeleteIndex));
    }
    setConfirmDeleteIndex(null);
    setDeleteType(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteIndex(null);
    setDeleteType(null);
  };

  const handleUseClick = () => {
    const defaultQuestion = {
      id: questions.length + 1,
      text: "What is the capital of France?",
      answer: "Paris",
    };
    setQuestions([...questions, defaultQuestion]);
  };

  const questionIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 48 48"
    >
      <g fill="none">
        <path
          stroke="#189EFE"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={4}
          d="M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2M30 4l10 10"
        ></path>
        <path
          stroke="#189EFE"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={4}
          d="M24 31v-3c2.21 0 4-2.015 4-4.5S26.21 19 24 19s-4 2.015-4 4.5"
        ></path>
        <path
          fill="#189EFE"
          fillRule="evenodd"
          d="M24 39a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5"
          clipRule="evenodd"
        ></path>
      </g>
    </svg>
  );

  const handleSave = async () => {
    // Validation
    if (!fakeChatbot.quizTitle.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    if (!fakeChatbot.topic.trim()) {
      toast.error("Please select a topic");
      return;
    }

    if (!fakeChatbot.category.trim()) {
      toast.error("Please select a category");
      return;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    // Validate all questions have text and answer
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim() || !questions[i].answer.trim()) {
        toast.error(`Question ${i + 1} is missing text or answer`);
        return;
      }
    }

    setSaving(true);

    try {
      // Prepare request data - must match backend expectation
      const requestData = {
        programData: {
          name: fakeChatbot.quizTitle,
          topic: fakeChatbot.topic,
          category: fakeChatbot.category,
          description: `${fakeChatbot.quizTitle} - Guided Questions Training`,
        },
        guidedQuestions: {
          enabled: true,
          freeAttempts: parseInt(fakeChatbot.freeAttempts) || 3,
          questions: questions.map((q) => ({
            question: q.text,
            answer: q.answer,
          })),
        },
      };

      console.log("📤 Sending guided questions data:", requestData);

      const response = await quizManagementAPI.createProgramWithQuiz(
        requestData
      );

      console.log("✅ Guided questions creation response:", response);

      if (response.success) {
        // Store the created program ID for use in other tabs
        const programId = response.data._id || response.data.program?._id;

        if (programId) {
          actions.setCreatedProgramId(programId);
          console.log("✅ Stored program ID:", programId);
          toast.success(
            "Guided questions training created successfully! You can now add documents or settings."
          );
        } else {
          console.warn("⚠️ No program ID found in response");
          toast.error(
            "Training created but ID not found. Please refresh the page."
          );
        }

        // Update context with the data
        actions.updateGuidedQuestions({
          questions: questions.map((q) => ({
            question: q.text,
            answer: q.answer,
          })),
        });

        // Don't reset - let user add documents or settings
      } else {
        toast.error(
          response.message || "Failed to create guided questions training"
        );
      }
    } catch (error) {
      console.error("❌ Failed to create guided questions training:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create training";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FakeChatbot fakeChatbot={fakeChatbot} onChange={setFakeChatbot} />
      <div className="flex h-full gap-6 relative">
        {/* Left Panel - Add Question */}
        <div className="w-1/2 p-6 rounded-lg h-full bg-[#F6F4FE]">
          <div className="flex items-center gap-1 mb-6">
            <Plus color="#1E90FF" />
            <h3 className="text-base font-medium text-black">
              Add New Question
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-normal text-black mb-2">
                Question *
              </label>
              <textarea
                value={newQuestion.text}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, text: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Enter question text..."
              />
            </div>

            <div>
              <label className="block text-sm font-normal text-black mb-2">
                Answer *
              </label>
              <textarea
                value={newQuestion.answer}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, answer: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Enter answer..."
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={addNewQuestion}
                disabled={!isFormValid()}
                className="w-80 text-white text-base py-2 px-4 rounded-lg font-normal transition-colors flex items-center justify-center
                bg-gradient-to-r from-[#189EFE] to-[#0E5F98]
                disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Question
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-1">{questionIcon()}</span>
                Question ({questions.length})
              </h3>
            </div>

            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {question.text}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Answer:</span>{" "}
                        {question.answer}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Section unchanged */}
          <div className="mt-8 bg-gray-50 rounded-lg py-6">
            <h4 className="text-base font-medium text-black mb-4">
              Upload Questions
            </h4>
            <div className="flex items-center relative">
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
              <div className="text-sm text-[#000] rounded-md w-full h-10 bg-white pl-36 mt-2 pt-2.5">
                {selectedFile ? selectedFile.name : "No file chosen"}
              </div>
            </div>
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="w-full bg-gradient-to-r from-[#189EFE] to-[#0E5F98] text-white py-2 px-4 rounded-lg text-base font-medium mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload
            </button>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Uploaded Questions
            </h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border border-[#DBDBDB] bg-white p-4 rounded-md"
                >
                  <span className="text-base text-black">{file.name}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleUseClick}
                      className="bg-[#1E90FF] text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => deleteFile(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {confirmDeleteIndex !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Are you sure you want to delete this?
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
      </div>

      <div className="flex items-center justify-center mt-10">
        <button
          onClick={handleSave}
          disabled={saving || questions.length === 0}
          className="w-80 bg-gradient-to-r from-[#189EFE] to-[#0E5F98] text-white text-base py-2 px-4 rounded-lg font-normal transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};
