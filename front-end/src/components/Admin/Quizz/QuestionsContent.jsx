import { useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { BasicInfo } from "./BasicInfo";
import { quizManagementAPI, questionAPI } from "../../../services/api.service";
import { useTrainingCreation } from "../../../hooks/useTrainingCreation";
import toast from "react-hot-toast";

export const QuestionsContent = () => {
  const { state, actions } = useTrainingCreation();
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // "file" | "question"
  const fileInputRef = useRef(null);

  // Use shared state
  const basicInfo = state.basicInfo;
  const questions = state.examSimulator.questions;
  const examSimulator = state.examSimulator;

  // Sample questions for the modal
  const availableQuestions = [
    "Which of the following is not a valid HTTP method?",
    "Which of the following is not a valid HTTP method?",
    "Which of the following is not a valid HTTP method?",
    "Which of the following is not a valid HTTP method?",
    "Which of the following is not a valid HTTP method?",
    "Which of the following is not a valid HTTP method?",
    "Which of the following is not a valid HTTP method?",
  ];

  // Initialize questions if empty
  if (questions.length === 0) {
    const defaultQuestion = {
      id: 1,
      text: "Which of the following is not a valid HTTP method?",
      type: "Single Choice MCQ",
      marks: 3,
      level: "Skill level",
      options: ["GET", "POST", "FETCH", "PUT"],
      correctAnswer: 2,
    };
    actions.addQuestion(defaultQuestion);
  }

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "Single Choice MCQ",
    marks: 3,
    level: "Skill level",
    options: ["", "", "", ""],
    correctAnswer: 0,
    correctTextAnswer: "",
  });

  // Upload states
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions([...Array(availableQuestions.length).keys()]);
    }
    setSelectAll(!selectAll);
  };

  const handleQuestionSelect = (index) => {
    if (selectedQuestions.includes(index)) {
      setSelectedQuestions(selectedQuestions.filter((i) => i !== index));
    } else {
      setSelectedQuestions([...selectedQuestions, index]);
    }
  };

  const handleSetQuestions = () => {
    // Handle setting selected questions
    setShowSelectModal(false);
    setSelectedQuestions([]);
    setSelectAll(false);
  };

  const addNewQuestion = () => {
    const newQ = {
      ...newQuestion,
      id: questions.length + 1,
    };
    actions.addQuestion(newQ);
    setNewQuestion({
      text: "",
      type: "Single Choice MCQ",
      marks: 3,
      level: "Skill level",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
  };

  const isFormValid = () => {
    if (!newQuestion.text.trim()) return false; // Question text must not be empty
    if (!newQuestion.marks) return false; // Marks must not be empty

    if (
      newQuestion.type === "Single Choice MCQ" ||
      newQuestion.type === "Multi Choice MCQ"
    ) {
      // All options should be filled
      if (newQuestion.options.some((opt) => !opt.trim())) return false;
    }

    if (
      newQuestion.type === "Text Answer" &&
      !newQuestion.correctTextAnswer.trim()
    ) {
      return false;
    }

    return true;
  };

  const updateQuestionOption = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  // Handle file choose
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      console.log("File selected:", e.target.files[0].name);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle file upload
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

  // Handle file delete
  const deleteFile = (index) => {
    setDeleteType("file");
    setConfirmDeleteIndex(index);
  };

  // Handle question delete
  const deleteQuestion = (id) => {
    setDeleteType("question");
    setConfirmDeleteIndex(id);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteType === "file") {
      setUploadedFiles(
        uploadedFiles.filter((_, i) => i !== confirmDeleteIndex)
      );
    } else if (deleteType === "question") {
      const questionIndex = questions.findIndex(
        (q) => q.id === confirmDeleteIndex
      );
      if (questionIndex !== -1) {
        actions.removeQuestion(questionIndex);
      }
    }
    setConfirmDeleteIndex(null);
    setDeleteType(null);
  };

  // Cancel delete
  const cancelDelete = () => {
    setConfirmDeleteIndex(null);
    setDeleteType(null);
  };

  const handleUseClick = () => {
    const defaultQuestion = {
      id: questions.length + 1,
      text: "What is the capital of France?",
      type: "Single Choice MCQ",
      marks: 3,
      level: "Beginner",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: 2, // Paris
    };
    actions.addQuestion(defaultQuestion);
  };

  // Save quiz with questions
  const saveQuizWithQuestions = async () => {
    // Validate basic info
    if (
      !basicInfo.quizTitle.trim() ||
      !basicInfo.topic ||
      !basicInfo.category
    ) {
      toast.error("Please fill in all basic information fields");
      return;
    }

    // Validate questions
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    setSaving(true);
    try {
      // Prepare data structure expected by backend
      const requestData = {
        programData: {
          name: basicInfo.quizTitle,
          topic: basicInfo.topic,
          category: basicInfo.category,
          description: basicInfo.description,
        },
        examSimulator: {
          enabled: true,
          timeLimit: parseInt(basicInfo.timeLimit) || 15,
          totalMarks: parseInt(basicInfo.totalMarks) || 100,
          maxAttempts: parseInt(basicInfo.maxAttempts) || 1,
          passingScore: 70,
          shuffleQuestions: true,
          shuffleOptions: true,
          showResults: true,
          showExplanations: true,
          questions: questions.map((q) => ({
            questionText: q.text,
            type:
              q.type === "Single Choice MCQ"
                ? "single"
                : q.type === "Multi Choice MCQ"
                ? "multiple"
                : q.type === "Text Answer"
                ? "short-answer"
                : "single",
            options: q.options
              ? q.options.map((opt, idx) => ({
                  text: opt,
                  isCorrect: idx === q.correctAnswer,
                }))
              : [],
            correctAnswers:
              q.type === "Text Answer" ? [q.correctTextAnswer] : [],
            explanation: q.explanation || "",
            mark: q.marks || 1,
            skillLevel: q.level === "Skill level" ? "Beginner" : q.level,
          })),
        },
      };

      const response = await quizManagementAPI.createProgramWithQuiz(
        requestData
      );

      console.log("✅ Training creation response:", response);

      if (response.success) {
        // Store the created program ID for use in other tabs
        // The response.data contains the program directly, not response.data.program
        const programId = response.data._id || response.data.program?._id;

        if (programId) {
          actions.setCreatedProgramId(programId);
          console.log("✅ Stored program ID:", programId);
          toast.success(
            "Training created successfully! You can now add documents or settings."
          );
        } else {
          console.warn("⚠️ No program ID found in response");
          toast.error(
            "Training created but ID not found. Please refresh the page."
          );
        }

        // Don't reset form here - let user add documents or make other changes
        // Form will be reset when user navigates away or clicks "Create New"
      } else {
        toast.error(response.message || "Failed to create training");
      }
    } catch (error) {
      console.error("❌ Failed to create training:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create training";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
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

  // Save button handler
  const handleSave = saveQuizWithQuestions;

  return (
    <div className="flex flex-col gap-6">
      <BasicInfo basicInfo={basicInfo} onChange={actions.updateBasicInfo} />
      <div className="flex h-full gap-6 relative">
        <div
          className={`flex h-full gap-6 w-full ${
            showSelectModal ? "blur-sm" : ""
          }`}
        >
          {/* Left Panel - Add Question */}
          <div className="w-1/2 p-6 rounded-lg h-full bg-[#F6F4FE]">
            <div className="flex items-center gap-1 mb-6">
              <Plus color="#1E90FF" />
              <h3 className="text-base font-medium text-black">
                Add New Question
              </h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-normal text-black mb-2">
                    Question Type
                  </label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option>Single Choice MCQ</option>
                    <option>Multi Choice MCQ</option>
                    <option>Text Answer</option>
                    <option>Fill in the Blank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-normal text-black mb-2">
                    Marks
                  </label>
                  <input
                    type="number"
                    value={newQuestion.marks}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        marks: Number.parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-normal text-black mb-2">
                    Level Select
                  </label>
                  <select
                    value={newQuestion.level}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, level: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option>Skill level</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-normal text-black mb-2">
                  Question Text *
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

              {/* Text Answer */}
              {newQuestion.type === "Text Answer" && (
                <div>
                  <label className="block text-sm font-normal text-black mb-2">
                    Correct Answer
                  </label>
                  <textarea
                    value={newQuestion.correctTextAnswer}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        correctTextAnswer: e.target.value,
                      })
                    }
                    rows={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 outline-none resize-none"
                    placeholder="Enter correct answer"
                  />
                </div>
              )}

              {/* Single Choice MCQ */}
              {newQuestion.type === "Single Choice MCQ" && (
                <div>
                  <div>
                    <label className="block text-sm font-normal text-black mb-3">
                      Answer Options
                    </label>
                    <div className="space-y-3">
                      {newQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center 
                            text-white text-xs font-semibold bg-[#2D889C] border border-[#278D93]"
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateQuestionOption(index, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder={`Option ${String.fromCharCode(
                              65 + index
                            )}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-normal text-black mb-3 mt-4">
                      Correct Answer(s)
                    </label>
                    <div className="space-y-2">
                      {newQuestion.options.map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={newQuestion.correctAnswer === index}
                            onChange={() =>
                              setNewQuestion({
                                ...newQuestion,
                                correctAnswer: index,
                              })
                            }
                            className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            Option {String.fromCharCode(65 + index)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Add Ques Button */}
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
            {/* Questions List */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="mr-1">{questionIcon()}</span>
                  Question ({questions.length})
                </h3>
                <button className="bg-gradient-to-r from-[#189EFE] to-[#0E5F98] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                  Total Marks: {3 * questions.length}
                </button>
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
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="font-medium">Question Details:</span>
                          <span>
                            Type: {question.type}, Marks: {question.marks},
                            Level: {question.level}
                          </span>
                        </div>
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
            <>
              {/* Upload Questions Section */}
              <div className="mt-8 bg-gray-50 rounded-lg py-6">
                <h4 className="text-base font-medium text-black mb-4">
                  Upload Questions
                </h4>
                <div className="flex items-center relative">
                  {/* Hidden input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Button that triggers input click */}
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

              {/* Uploaded Questions */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    Uploaded Questions
                  </h3>
                </div>
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

              {/* ✅ Confirm Delete Modal */}
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
            </>
          </div>
        </div>

        {showSelectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-[800px] max-h-[600px] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900 text-center">
                  Select questions
                </h2>
              </div>

              {/* Select All Section */}
              <div className="bg-[#2196F3] px-6 py-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-white bg-white border-2 border-white rounded focus:ring-white focus:ring-2 mr-3"
                  />
                  <span className="text-white font-medium text-lg">
                    Select All
                  </span>
                </label>
              </div>

              {/* Questions List */}
              <div className="max-h-[350px] overflow-y-auto">
                {availableQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="px-6 py-4 border-t border-gray-100 hover:bg-gray-50"
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(index)}
                        onChange={() => handleQuestionSelect(index)}
                        className="w-5 h-5 text-blue-600 bg-white  rounded focus:ring-blue-500 focus:ring-2 mr-4"
                      />
                      <span className="text-gray-900 text-base">
                        {question}
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 flex justify-end">
                <button
                  onClick={handleSetQuestions}
                  className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-8 py-2 rounded-lg font-medium text-base transition-colors"
                >
                  Set Questions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Save Button */}
      <div className="flex items-center justify-center mt-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-80 bg-gradient-to-r from-[#189EFE] to-[#0E5F98] text-white text-base py-2 px-4 rounded-lg font-normal transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving Training..." : "Save Training"}
        </button>
      </div>
    </div>
  );
};
