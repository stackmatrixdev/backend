import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import cross from "../../assets/images/cross.png";
import Button from "../../components/Shared/Button";
import aiHelp from "../../assets/images/aiHelp.png";
import retake from "../../assets/images/retake.png";
import Swal from "sweetalert2";
import ReactStars from "react-stars";
import { X } from "lucide-react"; // <-- import cross icon
const QuizResultPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const handleTagClick = (tag) => {
    setShowReviewModal(true);
    setReviewText(tag); // Optionally prefill with tag text
  };

  const [showReviewModal, setShowReviewModal] = useState(false); // To manage the review popup
  const [reviewText, setReviewText] = useState(""); // To hold the review text
  const [rating, setRating] = useState(5); // Default rating is 5

  const navigate = useNavigate();

  const quizResults = {
    score: 33,
    totalQuestions: 3,
    correctAnswers: 1,
    questions: [
      {
        id: 1,
        question:
          "What is the correct way to declare a variable in JavaScript?",
        correctAnswer: "var myVar;",
        userAnswer: "declare myVar;",
        isCorrect: false,
        explanation:
          "In JavaScript, variables are declared using 'var', 'let', or 'const' keywords.",
      },
      {
        id: 2,
        question:
          "What is the correct way to declare a variable in JavaScript?",
        correctAnswer: "var myVar;",
        userAnswer: "declare myVar;",
        isCorrect: false,
        explanation:
          "Variables in JavaScript should be declared with proper syntax.",
      },
      {
        id: 3,
        question:
          "What is the correct way to declare a variable in JavaScript?",
        correctAnswer: "var myVar;",
        userAnswer: "Correct answer: var myVar;",
        isCorrect: true,
        explanation:
          "Perfect! This is the correct way to declare a variable in JavaScript.",
      },
    ],
  };
  const tags = [
    "Loved the question format",
    "Challenging but helpful",
    "AI help was useful",
  ];
  const handleRetakeQuiz = () => {
    navigate(`/overview/${id}/exam-simulator`);
  };

  const handleGetAIHelp = () => {
    navigate(`/overview/${id}/ai-coach`, { state: { skill: "Intermediate" } });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Excellent work!";
    if (score >= 60) return "Good job!";
    return "Let's work on improvement!";
  };

  const handleReviewSubmit = () => {
    // Handle review submission and show success message
    Swal.fire({
      title: "THANKYOU FOR THE REVIEW!",
      text: "Your opinion matters to us...",
      icon: "success",
      draggable: true,
    });
    setShowReviewModal(false); // Close the modal after submission
  };

  return (
    <div className="min-h-screen w-full bg-[#575555]/5 py-4 md:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Result Card */}
        <div className="overflow-hidden">
          {/* Header */}
          <div className="flex items-center flex-col justify-center text-center relative">
            <img src={cross} className="w-16 2xl:w-auto" alt="" />
            <h1 className="text-xl md:text-3xl 2xl:text-4xl font-bold mb-2">
              Quiz Complete!
            </h1>
            <p className="text-gray">Here are your results</p>
          </div>

          {/* Score Section */}
          <div className="my-2 2xl:my-4 text-center">
            <div
              className={`text-3xl lg:text-5xl 2xl:text-6xl font-bold md:mb-2 text-primary`}
            >
              {quizResults.score}%
            </div>
            <p className="text-gray-600 my-2 md:my-4">
              You got {quizResults.correctAnswers} out of{" "}
              {quizResults.totalQuestions} questions correct
            </p>
            <p className={`font-medium text-primary text-xl`}>
              {getScoreMessage(quizResults.score)}
            </p>
          </div>

          {/* Questions Review */}
          <div className="p-4 2xl:p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 2xl:mb-6">
              Question Review
            </h3>
            <div className="space-y-4">
              {quizResults.questions.map((q, index) => (
                <div
                  key={q.id}
                  className={`border-2 rounded-xl p-4 ${
                    q.isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Question {index + 1}
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">{q.question}</p>
                    </div>
                    <div
                      className={`flex-shrink-0 ml-4 ${
                        q.isCorrect ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {q.isCorrect ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                    </div>
                  </div>

                  {/* Answers */}
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-green-700">
                        Correct answer:
                      </span>
                      <span className="text-gray-700">{q.correctAnswer}</span>
                    </div>
                    {!q.isCorrect && (
                      <div className="text-sm">
                        <span className="font-medium text-primary">
                          Your answer:{" "}
                        </span>
                        <span className="text-gray-700">{q.userAnswer}</span>
                      </div>
                    )}
                  </div>

                  {/* Explanation */}
                  <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 italic">
                      {!q.isCorrect
                        ? "Why this is wrong ans?"
                        : "Why this is right ans?"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 2xl:p-8 bg-gray-50">
            <div className="text-center mb-6">
              <p className="text-primary font-medium mb-4">
                "Let's review the sections you struggled with."
              </p>
            </div>

            <div className="flex flex-col items-center sm:flex-row gap-8 sm:gap-4 justify-center pt-4 2xl:pt-8">
              <div onClick={handleGetAIHelp} className="relative">
                <img
                  src={aiHelp}
                  className="absolute bottom-0 left-2 w-16 md:w-auto"
                  alt=""
                />
                <Button
                  rounded="lg"
                  padding="pl-20 md:pl-24 pr-4 py-2 md:py-3"
                  onClick={() => setShowReviewModal(true)}
                >
                  Get AI Help
                </Button>
              </div>

              <div onClick={handleRetakeQuiz} className="relative">
                <img
                  src={retake}
                  className="absolute bottom-0 left-2 w-12 md:w-auto"
                  alt=""
                />
                <button className="flex items-center justify-center gap-3 pl-20 border border-gray/50 text-black px-6 py-2 md:py-3 rounded-lg font-medium transition-colors">
                  Retake Quiz
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Tags */}
          <div className="p-3 2xl:p-6 ">
            <div className="flex flex-wrap justify-center gap-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  onClick={() => handleTagClick(tag)} // Handle tag click
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Review Modal */}

        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative">
              {/* Close (X) button */}
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                Submit Review
              </h2>

              <div className="flex gap-2 mb-4">
                <ReactStars
                  count={5}
                  value={rating}
                  onChange={setRating}
                  size={30}
                  color2={"#ffd700"}
                />
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={5}
                placeholder="Write your feedback here..."
                className="w-full p-3 border border-gray/50 rounded-lg mb-4"
              />

              <div className="text-center" onClick={handleReviewSubmit}>
                <Button rounded="lg" padding="w-1/3 py-2">
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResultPage;
