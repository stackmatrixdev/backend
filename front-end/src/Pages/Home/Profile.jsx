import {
  BookOpen,
  Trophy,
  MessageCircle,
  Play,
  Target,
  Award,
} from "lucide-react";
import profile1 from "../../assets/images/logo/profile1.png";
import profile2 from "../../assets/images/logo/profile2.png";
import profile3 from "../../assets/images/logo/profile3.png";
import learning from "../../assets/images/logo/learning.png";
import global from "../../assets/images/icon/global.png";
import star from "../../assets/images/icon/star.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { userAPI } from "../../services/api.service";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Profile() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getDashboardStats();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error(
        error.response?.data?.message || "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const now = new Date();
    const quizDate = new Date(date);
    const diffTime = Math.abs(now - quizDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return quizDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="h-[91vh] overflow-auto bg-[#F4F8FD] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentQuizzes = dashboardData?.recentQuizzes || [];
  const achievements = dashboardData?.achievements || [];
  const userName = dashboardData?.user?.name || auth.user?.name || "User";

  return (
    <div className="h-[91vh] overflow-auto bg-[#F4F8FD] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Welcome back, {userName}!
            </h1>
            <p className="text-gray mt-1">
              Continue your learning journey with AI-powered assistance
            </p>
          </div>
          <Link to={"/dashboard"}>
            <button className="bg-gradient-to-r from-teal-600 to-primary hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <MessageCircle size={20} />
              Ask AI Assistant
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#EDFAFF] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-bold text-xl">
                  Quizzes Completed
                </p>
                <p className="text-3xl font-medium text-[#3C76B9]">
                  {stats.quizzesCompleted || 0}
                </p>
              </div>
              <div className=" p-3 rounded-lg">
                <img src={profile1} alt="" />
              </div>
            </div>
          </div>

          <div className="bg-[#FFFAEA] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-bold text-xl">
                  Quiz Score Avg
                </p>
                <p className="text-3xl font-medium text-[#ECB404]">
                  {stats.averageScore || 0}%
                </p>
              </div>
              <div className=" p-3 rounded-lg">
                <img src={profile2} alt="" />
              </div>
            </div>
          </div>

          <div className="bg-[#DBECFF] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-bold text-xl">
                  AI Interactions
                </p>
                <p className="text-3xl font-medium text-[#3C76B9]">
                  {stats.aiInteractions || 0}
                </p>
              </div>
              <div className=" p-3 rounded-lg">
                <img src={profile3} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning */}
            {/* <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Play size={20} />
                Continue Learning
              </h2>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#D5F7FF] to-[#E2DAFF] rounded-lg p-4 ">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        JavaScript Fundamentals
                      </h3>
                    </div>
                    <span className="bg-gradient-to-r from-teal-600 to-primary text-white px-2 py-1 rounded-xl text-xs font-medium">
                      IN PROGRESS
                    </span>
                  </div>
                  <div className="w-full bg-[#ECECEC] rounded-full h-3 mb-3">
                    <div
                      className="bg-gradient-to-r from-teal-600 to-primary h-3 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    60% complete • 3 lessons remaining
                  </p>
                  <button className="bg-gradient-to-r from-teal-600 to-primary text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Continue Learning
                  </button>
                </div>

                <div className="bg-gradient-to-r from-[#EDFBFF] to-[#EEFCFF] rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        React Basics
                      </h3>
                    </div>
                    <span className="bg-[#ECECEC] text-black px-2 py-1 rounded-xl font-bold text-xs">
                      NOT STARTED
                    </span>
                  </div>
                  <div className="w-full bg-[#ECECEC] rounded-full h-3 mb-3">
                    <div
                      className="bg-gradient-to-r from-teal-600 to-primary h-3 rounded-full"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    0% complete • 12 quiz remaining
                  </p>
                  <button className="bg-[#ECECEC] text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    Start Quiz
                  </button>
                </div>
              </div>
            </div> */}

            {/* Recent Quiz Results */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy size={20} />
                Recent Quiz Results
              </h2>

              {recentQuizzes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No quiz attempts yet</p>
                  <p className="text-sm mt-2">
                    Start taking quizzes to see your results here!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentQuizzes.map((quiz, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-[#ECECEC] rounded-lg border border-gray"
                    >
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {quiz.quizName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(quiz.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-teal-600">
                          {Math.round(quiz.score)}%
                        </span>
                        <p className="text-xs text-white bg-primary rounded-xl px-4 py-1">
                          {quiz.grade}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Learning Assistant */}
            <div className="bg-gradient-to-r from-[#CEF0FF] to-[#ABC7E2] rounded-xl p-4 border border-blue-200 flex gap-6">
              <div className="w-24">
                <img src={learning} className="w-16" alt="" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    AI Learning Assistant
                  </h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Get help with questions, clarify concepts, and receive
                  personalized explanations.
                </p>
                <div className="inline-block">
                  <button className="bg-gradient-to-r from-teal-600 to-primary text-white px-4 py-2 rounded-lg text-sm transition-colors w-full">
                    Try Assistant
                  </button>
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            {/* <div className="bg-gradient-to-r from-[#FFF4FF] to-[#FFF6EC] rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <img src={global} alt="" />
                Learning Goals
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Weekly Study Goal
                    </span>
                    <span className="text-sm text-gray-600">10/15 hours</span>
                  </div>
                  <div className="w-full bg-[#ECECEC] rounded-full h-3 mb-3">
                    <div
                      className="bg-gradient-to-r from-teal-600 to-primary h-3 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Monthly Quizzes
                    </span>
                    <span className="text-sm text-gray-600">
                      8/10 completed
                    </span>
                  </div>
                  <div className="w-full bg-[#ECECEC] rounded-full h-3 mb-3">
                    <div
                      className="bg-gradient-to-r from-teal-600 to-primary h-3 rounded-full"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Recent Achievements */}
            <div className="bg-gradient-to-r from-[#FFF4FF] to-[#FFF6EC] rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <img src={star} alt="" />
                Recent Achievements
              </h2>

              {achievements.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No achievements yet</p>
                  <p className="text-xs mt-1">
                    Keep learning to earn achievements!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg shadow-lg ${
                        index === 0
                          ? "bg-[#FFFAEA]"
                          : "bg-gradient-to-r from-[#8DB3DE] to-[#84C7CD]"
                      }`}
                    >
                      <div className="p-2 rounded-lg">
                        <img
                          className="w-20"
                          src={index === 0 ? profile2 : profile1}
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col justify-between gap-2">
                        <h3 className="font-bold text-gray-900 text-sm">
                          {achievement.title || "Achievement"}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {achievement.description || "Keep up the good work!"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
