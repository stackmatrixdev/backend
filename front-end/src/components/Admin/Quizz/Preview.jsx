import { Settings, Trash2, Clock, Star, HelpCircle } from "lucide-react";
import { useTrainingCreation } from "../../../contexts/TrainingCreationContext";
import toast from "react-hot-toast";

const QuizPreview = () => {
  const { state, actions } = useTrainingCreation();

  // Get quiz data from context
  const { basicInfo, examSimulator, guidedQuestions } = state;

  // Determine if we're showing exam simulator or guided questions
  const isExamSimulator =
    examSimulator.questions && examSimulator.questions.length > 0;
  const isGuidedQuestions =
    guidedQuestions.questions && guidedQuestions.questions.length > 0;

  // Get the questions to display
  const questions = isExamSimulator
    ? examSimulator.questions
    : isGuidedQuestions
    ? guidedQuestions.questions
    : [];

  // Calculate quiz info
  const quizTitle = basicInfo.quizTitle || basicInfo.title || "Sample Quiz";
  const duration = basicInfo.timeLimit || examSimulator.timeLimit || 30;
  const totalMarks = isExamSimulator
    ? examSimulator.questions.reduce(
        (sum, q) => sum + (parseInt(q.marks) || 0),
        0
      )
    : basicInfo.totalMarks || 20;
  const questionsCount = questions.length || 0;

  // Helper function to get option label (A, B, C, D)
  const getOptionLabel = (index) => String.fromCharCode(65 + index);

  // Delete question handler
  const handleDeleteQuestion = (questionIndex) => {
    if (
      window.confirm(
        `Are you sure you want to delete Question ${questionIndex + 1}?`
      )
    ) {
      actions.removeQuestion(questionIndex);
      toast.success(`Question ${questionIndex + 1} deleted successfully`);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 rounded-md">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Settings size={20} color="#1E90FF" />
          <h1 className="text-base font-medium text-black">Quiz Preview</h1>
        </div>
        <p className="text-gray-600 ml-8 font-normal text-xs">
          Preview how your quiz will appear to students
        </p>
      </div>

      {/* Quiz Info Card */}
      <div className="bg-[#F5F6F6] rounded-lg border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl text-black">{quizTitle}</h2>
        </div>

        <div className="flex items-center gap-6 font-light text-base text-gray-600">
          {/* Duration */}
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{duration} minutes</span>
          </div>

          {/* Marks */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-blue-500" />
            <span>{totalMarks} marks</span>
          </div>

          {/* Questions Count */}
          <div className="flex items-center gap-1">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span>{questionsCount} questions</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      {questions.length > 0 ? (
        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="bg-white rounded-lg p-6 border border-gray-200"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#0F6098] text-white text-sm font-medium px-3 py-1 rounded">
                    Question {qIndex + 1}
                  </span>
                  {isExamSimulator && question.marks && (
                    <span className="text-sm text-gray-600">
                      ({question.marks}{" "}
                      {parseInt(question.marks) === 1 ? "mark" : "marks"})
                    </span>
                  )}
                </div>
                {/* Delete button for both Exam Simulator and Guided Questions */}
                <button
                  onClick={() => handleDeleteQuestion(qIndex)}
                  className="flex items-center gap-1 border px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={14} color="#FF0000" />
                  Delete
                </button>
              </div>

              {/* Question Text */}
              <h3 className="text-black font-medium mb-4">
                {question.text ||
                  question.question ||
                  question.questionText ||
                  "No question text"}
              </h3>

              {/* Answer Options for Exam Simulator */}
              {isExamSimulator &&
                question.options &&
                question.options.length > 0 && (
                  <div className="space-y-3">
                    {question.options.map((option, optIndex) => {
                      // Handle both string and object options
                      const optionText =
                        typeof option === "string"
                          ? option
                          : option.text ||
                            option.optionText ||
                            `Option ${optIndex + 1}`;
                      const isCorrect =
                        typeof option === "object"
                          ? option.isCorrect
                          : optIndex === question.correctAnswer;

                      return (
                        <div key={optIndex} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#278D93] text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {getOptionLabel(optIndex)}
                          </div>
                          <div
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg border ${
                              isCorrect
                                ? "bg-[#A5FFDD] border-green-300"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <span className="text-black">{optionText}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              {/* Answer for Guided Questions */}
              {isGuidedQuestions && question.answer && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-green-700 font-medium text-sm">
                      Answer:
                    </span>
                    <p className="text-gray-700 text-sm flex-1">
                      {question.answer}
                    </p>
                  </div>
                </div>
              )}

              {/* Question Type Badge for Exam Simulator */}
              {isExamSimulator && question.type && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {question.type}
                  </span>
                  {question.marks && (
                    <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                      {question.marks}{" "}
                      {parseInt(question.marks) === 1 ? "mark" : "marks"}
                    </span>
                  )}
                  {question.level && (
                    <span className="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
                      {question.level}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
          <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Questions Yet
          </h3>
          <p className="text-gray-500 text-sm">
            Create questions in the Exam Simulator or Guided Questions tab to
            see the preview
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizPreview;
