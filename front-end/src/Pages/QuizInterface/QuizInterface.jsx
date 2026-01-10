import React, { useState } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizResultPage from "./QuizResultPage";

const QuizInterface = ({ quizResultShow }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // For multiple answers, store selected options as arrays per question
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(1 * 60); // 15 minutes in seconds
  // Sample questions data
  const questions = [
    {
      id: 1,
      question:
        "Which of the following best describes the main function of the LearnGPT platform?",
      options: [
        "It helps users play educational games online",
        "It provides AI-powered quiz practice and learning support",
        "It allows students to hire tutors directly",
        "It is a video streaming platform for online classes",
      ],
      type: "multiple", // multiple correct answers
    },
    {
      id: 2,
      question:
        "What is the primary benefit of using AI in educational platforms?",
      options: [
        "Reduces the need for human teachers",
        "Provides personalized learning experiences",
        "Makes learning completely automated",
        "Eliminates the need for textbooks",
      ],
      type: "single", // single correct answers
    },
    {
      id: 3,
      question: "How does adaptive learning technology work?",
      options: [
        "It uses the same content for all students",
        "It adjusts difficulty based on student performance",
        "It only works with video content",
        "It requires manual input from teachers",
      ],
      type: "multiple", // multiple correct answers
    },
  ];

  const totalQuestions = questions.length;
  const completedQuestions = Object.keys(selectedAnswers).length;
  const progressPercentage = Math.round(
    (completedQuestions / totalQuestions) * 100
  );

  // Timer effect
  // Timer effect with auto-submit on timeout
  React.useEffect(() => {
    if (timeRemaining === 0) {
      // navigate("/quiz-result");
      quizResultShow();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Answer selection logic for single/multiple
  const handleAnswerSelect = (optionIndex) => {
    const type = questions[currentQuestion].type;
    setSelectedAnswers((prev) => {
      if (type === "multiple") {
        const prevSelected = prev[currentQuestion] || [];
        // Toggle selection
        if (prevSelected.includes(optionIndex)) {
          // Deselect
          return {
            ...prev,
            [currentQuestion]: prevSelected.filter((i) => i !== optionIndex),
          };
        } else {
          // Select
          return {
            ...prev,
            [currentQuestion]: [...prevSelected, optionIndex],
          };
        }
      } else {
        // Single choice: only one selected
        return {
          ...prev,
          [currentQuestion]: [optionIndex],
        };
      }
    });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleQuestionNavigate = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  const handleSubmit = () => {
    if (location.pathname === "/quiz") {
      navigate("/quiz-result");
    } else {
      navigate("/overview/1/quiz-result");
    }
  };

  return (
    <div className="bg-gray-50 py-4 md:py-8 px-2 w-full">
      <div className="max-w-4xl w-full mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="w-full bg-[#D4EDFF] rounded-full h-3 relative">
              <div
                className="bg-gradient-to-r from-teal-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="ml-4 text-sm font-medium text-gray-700 min-w-[3rem]">
              {progressPercentage}%
            </span>
          </div>
        </div>

        {/* Question Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Question Info Bar */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Question {currentQuestion + 1}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {totalQuestions}
                </div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-2 md:p-8">
            <h3 className="md:text-lg font-medium text-gray-800 mb-6 leading-relaxed">
              {questions[currentQuestion].question}
            </h3>

            {/* Answer Options: single or multiple */}
            <div className="space-y-2 md:space-y-4">
              {questions[currentQuestion].options.map((option, index) => {
                const type = questions[currentQuestion].type;
                const selectedArr = selectedAnswers[currentQuestion] || [];
                const isSelected = selectedArr.includes(index);
                return (
                  <label
                    key={index}
                    className={`flex items-center text-sm md:text-base p-2 md:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type={type === "multiple" ? "checkbox" : "radio"}
                      name={`question-${currentQuestion}`}
                      value={index}
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(index)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 mr-4 flex items-center justify-center border-2 ${
                        type === "multiple"
                          ? `rounded-md ${
                              isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`
                          : `rounded-full ${
                              isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`
                      }`}
                    >
                      {isSelected && (
                        <div
                          className={
                            type === "multiple"
                              ? "w-3 h-3 bg-white rounded-sm"
                              : "w-3 h-3 bg-white rounded-full"
                          }
                        ></div>
                      )}
                    </div>
                    <span className="text-gray-700 leading-relaxed">
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              {/* Previous button only from question 2 onwards */}
              {currentQuestion > 0 ? (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors bg-black text-white hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              ) : (
                <div />
              )}
              {currentQuestion === totalQuestions - 1 ? (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600
                  `}
                >
                  Submit
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors 
                      bg-blue-500 text-white hover:bg-blue-600
                  `}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-8 flex justify-center  w-full">
          <div className="bg-white rounded-tl-2xl w-2/5 rounded-br-2xl border-b-2 shadow-lg border border-gray/50 p-4">
            <h4 className="text-left text-gray-800 font-bold mb-3 text-base">
              Question Navigator
            </h4>
            <div className="flex gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionNavigate(index)}
                  className={`w-12 h-6 rounded-tl-lg rounded-br-lg rounded-tr-sm rounded-bl-sm font-semibold text-sm transition-all duration-200 ${
                    index === currentQuestion
                      ? "  bg-gradient-to-r from-[#189EFE] to-[#0E5F98] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray/50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quiz Stats */}
        {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {completedQuestions}
            </div>
            <div className="text-sm text-gray-600">Questions Completed</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {totalQuestions - completedQuestions}
            </div>
            <div className="text-sm text-gray-600">Questions Remaining</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-600">Time Remaining</div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default QuizInterface;
