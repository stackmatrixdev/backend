import { Search } from "lucide-react";
import QuizManagement from "./AllQuizzes";
import { useState, useEffect } from "react";
import QuizCreator from "./CreateNewQuizz";
import { EditQuizz } from "./EditQuizz";
import { quizManagementAPI } from "../../../services/api.service";

export const Quizz = () => {
  const [showBasicInfo, setShowBasicInfo] = useState(false);
  const [editQuizz, setEditQuizz] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0,
    loading: true,
  });

  // Fetch quiz statistics
  useEffect(() => {
    fetchQuizStats();
  }, []);

  const fetchQuizStats = async () => {
    try {
      const response = await quizManagementAPI.getDashboardQuizStats();
      if (response.success) {
        setQuizStats({
          ...response.data,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch quiz statistics:", error);
      setQuizStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleCreateClick = () => {
    setShowBasicInfo(true);
  };
  const handleEditQuizz = (quiz) => {
    setSelectedQuiz(quiz);
    setEditQuizz(true);
  };

  // === Conditional Rendering ===
  if (showBasicInfo) {
    return <QuizCreator setShowBasicInfo={setShowBasicInfo} />;
  }
  if (editQuizz && selectedQuiz) {
    return (
      <EditQuizz quiz={selectedQuiz} onClose={() => setEditQuizz(false)} />
    );
  }

  const dollarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={36}
      viewBox="0 0 16 16"
    >
      <path
        fill="none"
        stroke="#4CAF50"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        d="M6 10h2.5c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1-.45-1-1s.45-1 1-1H10M8 4.5v1.167M8 9.5v2M14.5 8a6.5 6.5 0 1 1-13 0a6.5 6.5 0 0 1 13 0Z"
        strokeWidth={1}
      ></path>
    </svg>
  );
  const userIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={36}
      viewBox="0 0 16 16"
    >
      <path
        fill="#2F89CA"
        d="M11 7c0 1.66-1.34 3-3 3S5 8.66 5 7s1.34-3 3-3s3 1.34 3 3"
      ></path>
      <path
        fill="#2F89CA"
        fillRule="evenodd"
        d="M16 8c0 4.42-3.58 8-8 8s-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8M4 13.75C4.16 13.484 5.71 11 7.99 11c2.27 0 3.83 2.49 3.99 2.75A6.98 6.98 0 0 0 14.99 8c0-3.87-3.13-7-7-7s-7 3.13-7 7c0 2.38 1.19 4.49 3.01 5.75"
        clipRule="evenodd"
      ></path>
    </svg>
  );
  const membershipIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={36}
      viewBox="0 0 24 24"
    >
      <path
        fill="#FBBC04"
        d="M23 3v18H1V3zm-2 2H3v4h18zm0 6h-2v6.766l-3.5-2.1l-3.5 2.1V11H3v8h18zm-4 0h-3v3.234l1.5-.9l1.5.9z"
      ></path>
    </svg>
  );

  return (
    <div className="py-4 md:py-16">
      <div className="px-7 flex flex-col md:flex-row justify-between items-center pb-12 gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-medium text-[#1E90FF]">
            Quiz Management
          </h1>
          <p className="text-sm text-[#929292]">
            Create, manage, and analyze your quizzes
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="bg-gradient-to-r from-[#189EFE] to-[#0E5F98] text-white px-6 py-3 rounded-lg text-2xl font-medium"
        >
          + Create Training
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 mb-6 sm:mx-0 md:mx-14">
        {/* Quizzes */}
        <div className="flex items-center justify-between gap-5 p-6 bg-[#EDF6ED] border border-white rounded-xl shadow-2xl">
          <div className="flex flex-col gap-1">
            <p className="bg-gradient-to-r from-[#1E90FF] to-[#0E5F98] bg-clip-text text-transparent font-medium text-2xl">
              Total Quizzes
            </p>
            <p className="text-black font-medium text-xl">
              {quizStats.loading
                ? "Loading..."
                : quizStats.totalQuizzes.toLocaleString()}
            </p>
            <p className="text-[#4CAF50] font-light text-base">
              {quizStats.loading ? "..." : `${quizStats.activeQuizzes} active`}
            </p>
          </div>
          <div className="p-4 bg-[#D5FED7] rounded-xl shadow-md">
            {dollarIcon()}
          </div>
        </div>
        {/* Attempts */}
        <div className="flex items-center justify-between gap-5 p-6 bg-[#D5E9F8] border border-white rounded-xl shadow-2xl">
          <div className="flex flex-col gap-1">
            <p className="bg-gradient-to-r from-[#1E90FF] to-[#0E5F98] bg-clip-text text-transparent font-medium text-2xl">
              Total Attempts
            </p>
            <p className="text-black font-medium text-xl">
              {quizStats.loading
                ? "Loading..."
                : quizStats.totalAttempts.toLocaleString()}
            </p>
            <p className="text-[#4CAF50] font-light text-base">
              {quizStats.loading
                ? "..."
                : `${quizStats.completedAttempts} completed`}
            </p>
          </div>
          <div className="p-4 bg-[#92CFFB] rounded-xl shadow-md">
            {userIcon()}
          </div>
        </div>
        {/* Average Score */}
        <div className="flex items-center justify-between gap-5 p-6 bg-[#F1EDDF] border border-white rounded-xl shadow-2xl">
          <div className="flex flex-col gap-1">
            <p className="bg-gradient-to-r from-[#1E90FF] to-[#0E5F98] bg-clip-text text-transparent font-medium text-2xl">
              Average Score
            </p>
            <p className="text-black font-medium text-xl">
              {quizStats.loading
                ? "Loading..."
                : `${Math.round(quizStats.averageScore)}%`}
            </p>
            <p className="text-[#4CAF50] font-light text-base">
              {quizStats.loading
                ? "..."
                : `${quizStats.completionRate}% completion rate`}
            </p>
          </div>
          <div className="p-4 bg-[#FFF0C4] rounded-xl shadow-md">
            {membershipIcon()}
          </div>
        </div>
      </div>

      <div className="py-2 md:py-5 mx-0 md:mx-14 bg-white">
        <div className="mx-2 md:mx-10 py-5 border border-[#C4C4C4] rounded-lg">
          <div className="flex items-center gap-3 px-4">
            <Search className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search All Quizzes"
              className="w-full outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="py-5 mx-0 md:mx-14">
        <QuizManagement handleEditQuizz={handleEditQuizz} />
      </div>
    </div>
  );
};
