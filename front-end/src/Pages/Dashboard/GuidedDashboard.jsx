import React, { useState, useEffect, useMemo } from "react";
import tic from "../../assets/images/tic.png";
import pricing1 from "../../assets/images/pricing1.png";
import pricing2 from "../../assets/images/pricing2.png";
import pricing3 from "../../assets/images/pricing3.png";
import logo from "../../assets/images/logo.png";
import { Sparkles, ChevronDown, Lock } from "lucide-react";
import Button from "../../components/Shared/Button";
import botProfile from "../../assets/images/botProfile.jpg";
import userProfile from "../../assets/images/userProfile.jpg";
import { Link } from "react-router-dom";
import { GoSidebarExpand } from "react-icons/go";
import { programAPI } from "../../services/api.service";

const GuidedDashboard = ({ embedded, programId }) => {
  const [showPricingModal, setShowPricingModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isSubscribed, setIsSubscribed] = useState(false);
  // Guided conversations - predefined Q&A only (NO API calls)
  const [conversations, setConversations] = useState([
    {
      sender: "ai",
      text: "Welcome to Guided Learning! Click on a question from the sidebar to see the answer. 📚",
    },
  ]);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [program, setProgram] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  // Fetch program data with guided questions
  useEffect(() => {
    const fetchProgram = async () => {
      if (!programId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await programAPI.getById(programId);
        if (response.success) {
          setProgram(response.data);
          console.log("📚 Program fetched:", response.data);
          console.log(
            "📋 Guided Questions Data:",
            response.data?.guidedQuestions
          );
          console.log(
            "✅ Questions Array:",
            response.data?.guidedQuestions?.questions
          );
        } else {
          console.error("❌ Failed to fetch program:", response);
        }
      } catch (error) {
        console.error("❌ Error fetching program:", error);
        console.error(
          "❌ Error details:",
          error.response?.data || error.message
        );
        // If auth error, may need to re-login
        if (error.response?.status === 401) {
          console.error("🔐 Authentication error - Token may be invalid");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [programId]);

  // Handle resize for mobile/tablet detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle GUIDED QUESTION click - shows pre-made answer (NO API call)
  const handleGuidedQuestionClick = (question) => {
    const userMessage = question;
    setConversations((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    // Find the answer from the database guided questions
    const questionData = program?.guidedQuestions?.questions?.find(
      (gq) => gq.question === question
    );
    const answer = questionData?.answer;

    if (!answer) {
      setConversations((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I don't have a pre-made answer for this question in my database. Please use the Free Questions section to get a personalized answer from AI.",
        },
      ]);
    } else {
      setConversations((prev) => [
        ...prev,
        {
          sender: "ai",
          text: answer,
        },
      ]);
    }

    setSidebarOpen(false);
  };

  const handleMaybeLater = () => {
    setShowPricingModal(false);
  };

  const plans = [
    {
      title: "Exam Simulator Only",
      price: "19.99 CAD",
      period: "Per Month",
      color: "bg-[#A1D1FF]",
      features: ["Mock Exams & Practice"],
      buttonText: "Choose Plan",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      image: pricing3,
      scale: false,
    },
    {
      title: "Full Access",
      price: "29.99 CAD",
      period: "Per Month",
      color: "bg-[#42A5FF]",
      popular: true,
      features: ["Quiz", "Chatbot", "Docs"],
      originalPrice: "39.99 CAD",
      buttonText: "Choose Plan",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      image: pricing2,
      scale: true,
    },
    {
      title: "AI Coach Only",
      price: "19.99 CAD",
      period: "Per Month",
      color: "bg-[#7ED6D1]",
      features: ["Chat + Smart Guidance"],
      buttonText: "Choose Plan",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      image: pricing1,
      scale: false,
    },
  ];

  // Get guided questions from database (program data)
  // Only show questions that exist in the database
  // Check if guided questions feature is enabled and questions array exists
  const databaseGuidedQuestions = useMemo(() => {
    return program?.guidedQuestions?.enabled &&
      program?.guidedQuestions?.questions
      ? program.guidedQuestions.questions
      : [];
  }, [program]);

  // Debug: Log the processed questions
  useEffect(() => {
    if (program) {
      console.log(
        "🔍 Database Guided Questions Count:",
        databaseGuidedQuestions.length
      );
      console.log("🔍 Enabled:", program?.guidedQuestions?.enabled);
      console.log("🔍 Questions:", databaseGuidedQuestions);
    }
  }, [program, databaseGuidedQuestions]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = isMobileOrTablet
    ? sidebarOpen
      ? "w-72"
      : "w-16"
    : "w-72";

  return (
    <div className="font-Poppins flex h-screen w-full bg-[#575555]/10 relative">
      {showPricingModal && !isSubscribed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 md:px-8 xl:px-0">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-2/3 md:w-full max-h-[90vh] overflow-y-auto">
            <div className="text-left px-3 sm:px-20 pt-2 md:py-2 lg:py-6">
              <h2 className="text-xl lg:text-3xl font-bold md:mb-2 text-primary">
                Unlock AI Coach Access
              </h2>
              <p className="text-gray text-sm md:text-base">
                Get unlimited access to our AI Coach for 30 days!
              </p>
            </div>

            <div className="px-4 lg:px-20 py-3 lg:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 mx-auto">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-lg overflow-hidden shadow-lg flex flex-col h-full`}
                  >
                    {plan.popular && (
                      <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-[#FFB563] text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium z-10">
                        Best Deal
                      </div>
                    )}

                    <div
                      className={`${plan.color} p-2 md:p-8 text-white text-center relative flex flex-col items-center`}
                    >
                      <img src={plan.image} className="w-10 md:w-auto" alt="" />
                      <h3 className="md:text-xl text-sm font-semibold md:my-2">
                        {plan.title}
                      </h3>
                    </div>

                    <div className="p-2 md:p-6 flex flex-col flex-grow items-center lg:items-start">
                      <div className="flex-1">
                        {plan.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center mb-2"
                          >
                            <img src={tic} className="w-4 md:w-auto" alt="" />
                            <span className="ml-2 text-gray-700 text-xs md:text-sm">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mb-2 md:mb-4 flex-1">
                        {plan.originalPrice && (
                          <div className="text-gray line-through text-xs md:text-sm md:mb-1">
                            {plan.originalPrice}
                          </div>
                        )}
                        <div className="text-lg md:text-2xl font-bold text-primary md:mb-1">
                          {plan.price}
                        </div>
                        <div className="text-gray-600 text-xs md:text-sm">
                          {plan.period}
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Button
                          rounded="lg"
                          padding="text-xs px-2 py-1 md:px-6 md:text-base"
                        >
                          Choose Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                onClick={handleMaybeLater}
                className="text-center my-2 md:my-6 border border-gray/50 rounded-md py-1 md:py-3 cursor-pointer w-9/12 mx-auto"
              >
                <button className="text-gray-500 text-sm md:text-base hover:text-gray-700 font-medium transition-colors">
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`${sidebarWidth} bg-[#0062A7] text-white flex flex-col h-full z-40 transition-all duration-300 ${
          isMobileOrTablet ? "absolute top-0 left-0 h-full" : ""
        }`}
        style={
          isMobileOrTablet
            ? { position: "absolute", top: 0, left: 0, height: "100%" }
            : {}
        }
      >
        <div className="flex items-center justify-between p-4">
          <button
            className="bg-blue-500 text-white rounded-full p-2 shadow-lg lg:hidden"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <GoSidebarExpand />
          </button>
          {(sidebarOpen || !isMobileOrTablet) && (
            <Link to={"/"} className="flex items-center space-x-2 ml-2">
              <img src={logo} className="w-12" alt="" />
              <p className="text-[#011F47] font-bold text-2xl">
                Learnin<span className="text-primary">GPT</span>
              </p>
            </Link>
          )}
        </div>

        {(sidebarOpen || !isMobileOrTablet) && (
          <>
            <div className="flex-1 p-6">
              <h3 className="text-blue-200 font-medium mb-4">
                Guided Questions
              </h3>
              <div className="space-y-2">
                {/* Only show questions from database */}
                {databaseGuidedQuestions.length > 0 ? (
                  <div className="p-2 rounded-lg bg-[#00518F]/80">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        setDropdownIndex(dropdownIndex === 0 ? null : 0)
                      }
                    >
                      <span>{program?.name || "Course Questions"}</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          dropdownIndex === 0 ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {dropdownIndex === 0 && (
                      <div className="mt-2 bg-white rounded-lg shadow-lg text-black">
                        {databaseGuidedQuestions.map((q, qIdx) => {
                          // Lock questions based on freeAttempts from database (default 3)
                          const freeAttempts =
                            program?.guidedQuestions?.freeAttempts || 3;
                          const isLocked =
                            qIdx >= freeAttempts && !isSubscribed;
                          return (
                            <React.Fragment key={qIdx}>
                              <div
                                className={`px-3 py-2 flex items-center justify-between text-sm ${
                                  isLocked
                                    ? "bg-gray-100 text-gray cursor-pointer"
                                    : "hover:bg-blue-100 cursor-pointer text-gray-900"
                                }`}
                                onClick={() => {
                                  if (isLocked) {
                                    setShowPricingModal(true);
                                  } else {
                                    handleGuidedQuestionClick(q.question);
                                  }
                                }}
                              >
                                <span>{q.question}</span>
                                {isLocked && (
                                  <Lock className="w-4 h-4 text-gray" />
                                )}
                              </div>
                              {qIdx < databaseGuidedQuestions.length - 1 && (
                                <div className="border-t border-gray-200 mx-2"></div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-blue-200 text-sm p-2">
                    <p>No guided questions available for this course.</p>
                    {program && (
                      <p className="text-xs mt-2">
                        Enabled:{" "}
                        {String(program?.guidedQuestions?.enabled || false)}
                        <br />
                        Questions count:{" "}
                        {program?.guidedQuestions?.questions?.length || 0}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {isMobileOrTablet && sidebarOpen && (
        <div
          className="absolute inset-0 bg-black bg-opacity-30 z-30"
          style={{ pointerEvents: "auto" }}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {embedded ? (
        <div className="flex-1 flex flex-col ml-0">
          {/* Header for Embedded Mode - Guided Learning Only */}
          <div className="border-b border-gray/50 px-6 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                📚 Guided Learning
              </h2>
              <span className="text-sm text-gray font-semibold">
                Click questions from sidebar to view answers
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-between h-[85vh]">
            <div className="w-full flex flex-col items-center mt-6 overflow-y-auto h-[68vh]">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-xl lg:text-2xl bg-gradient-to-r from-[#278D93] to-[#189EFE] bg-clip-text text-transparent">
                  Click on questions to view answers
                </p>
              </div>

              {conversations.length > 0 && (
                <div className="md:w-10/12 mx-auto flex flex-col gap-3 mb-3 md:mb-6">
                  {conversations.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.sender !== "user" && (
                        <div className="rounded-full mr-2 h-12 w-12 flex items-center justify-center">
                          <img
                            className="rounded-full w-8 md:w-auto"
                            src={botProfile}
                            alt=""
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] px-2 py-1 md:px-5 md:py-3 text-sm md:text-base rounded-xl shadow-sm break-words ${
                          msg.sender === "user"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white/80 text-gray-800 border border-blue-100 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.sender === "user" && (
                        <div className="rounded-full ml-2 h-12 w-12 flex items-center justify-center">
                          <img
                            className="rounded-full w-8 md:w-auto"
                            src={userProfile}
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom area - Guided Learning info message (no input field) */}
            <div className="px-2 md:px-0 py-2 md:py-0 md:w-10/12 md:mb-6 w-full">
              <div className="w-full">
                <div className="bg-white border border-gray/50 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-center px-2 py-4 md:p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        ✅ Click questions from the left sidebar to view
                        pre-made answers
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        💡 For custom questions, go back and select "Free
                        Questions" mode
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Non-embedded mode - Guided Learning Only */
        <div className="flex-1 flex flex-col ml-0">
          <div className="border-b border-gray/50 px-6 py-4">
            <div className="text-sm text-gray font-semibold text-end">
              📚 Guided Learning Mode
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-between h-[90vh]">
            <div className="w-full flex flex-col items-center mt-6 overflow-y-auto h-full">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-xl lg:text-2xl bg-gradient-to-r from-[#278D93] to-[#189EFE] bg-clip-text text-transparent">
                  Click on questions to view answers
                </p>
              </div>
              {conversations.length > 0 && (
                <div className="md:w-10/12 mx-auto flex flex-col gap-3 mb-3 md:mb-6">
                  {conversations.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.sender !== "user" && (
                        <div className="rounded-full mr-2 h-12 w-12 flex items-center justify-center">
                          <img
                            className="rounded-full w-8 md:w-auto"
                            src={botProfile}
                            alt=""
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] px-2 py-1 md:px-5 md:py-3 text-sm md:text-base rounded-xl shadow-sm break-words ${
                          msg.sender === "user"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white/80 text-gray-800 border border-blue-100 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.sender === "user" && (
                        <div className="rounded-full shadow-sm ml-2 h-12 w-12 flex items-center justify-center">
                          <img
                            className="rounded-full w-8 md:w-auto"
                            src={userProfile}
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom area - Guided Learning info message (no input field) */}
            <div className="px-2 md:px-0 py-2 md:py-0 md:w-10/12 md:mb-6 w-full">
              <div className="w-full">
                <div className="bg-white border border-gray/50 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-center px-2 py-4 md:p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        ✅ Click questions from the left sidebar to view
                        pre-made answers
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        💡 For custom questions, go back and select "Free
                        Questions" mode
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidedDashboard;
