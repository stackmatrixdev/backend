// ...existing code...
import { useNavigate, useParams, Outlet, useLocation } from "react-router-dom";
import CourseOverviewTab from "./CourseOverviewTab";
import DocumentationTab from "./DocumentationTab";
import AiCoachTab from "./AiCoachTab";
import ExamSimulatorTab from "./ExamSimulatorTab";
import car from "../../assets/images/car.png";
import tab2 from "../../assets/images/icon/tab2.png";
import tab3 from "../../assets/images/icon/tab3.png";
import tab4 from "../../assets/images/icon/tab4.png";
import tab5 from "../../assets/images/icon/tab5.png";
import { Star } from "lucide-react";
import CourseCompletionCertificate from "./CourseCompletionCertificate";
import { RiMenuSearchLine } from "react-icons/ri";
import { ScrollRestoration } from "react-router-dom";
import { useState, useEffect } from "react";
import { programAPI, getImageUrl } from "../../services/api.service";
import toast from "react-hot-toast";

export default function MovingCarTabs() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [program, setProgram] = useState(null);

  useEffect(() => {
    fetchProgram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProgram = async () => {
    try {
      const response = await programAPI.getById(id);
      if (response.success) {
        setProgram(response.data);
      }
    } catch (error) {
      console.error("Error fetching program:", error);
      toast.error("Failed to load course details");
    }
  };

  // get the tab segment from the URL (/overview/:id/:tab)
  const tabRoute = location.pathname.split("/")[3] || "course-overview";
  // keep the car on "exam-simulator" when viewing quiz-result
  const resolvedTabRoute =
    tabRoute === "quiz-result" ? "exam-simulator" : tabRoute;

  const tabIds = [
    "course-overview",
    "documentation",
    "ai-coach",
    "exam-simulator",
    "certification",
  ];

  // ensure activeTab is a valid index (fallback to 0)
  const idx = tabIds.indexOf(resolvedTabRoute);
  const activeTab = idx === -1 ? 0 : idx;

  const tabs = [
    {
      id: "course-overview",
      title: "Course Overview",
      subtitle: "See your learning path",
      active: true,
      content: <CourseOverviewTab />,
    },
    {
      id: "documentation",
      title: "Documentation",
      subtitle: "Study comprehensive materials",
      icon: tab3,
      active: false,
      content: <DocumentationTab />,
    },
    {
      id: "ai-coach",
      title: "AI Coach",
      subtitle: "Get personalized guidance",
      icon: tab2,
      active: false,
      content: <AiCoachTab />,
    },
    {
      id: "exam-simulator",
      title: "Exam Simulator",
      subtitle: "Practice with mock exams",
      icon: tab4,
      active: false,
      content: <ExamSimulatorTab />,
    },
    {
      id: "certification",
      title: "Certification",
      subtitle: "Earn your certificate",
      icon: tab5,
      active: false,
      content: <CourseCompletionCertificate />,
    },
  ];

  return (
    <div className="bg-[#F4F8FD]">
      <ScrollRestoration />
      <div className="text-center pt-8 max-w-7xl mx-auto">
        <button className="bg-[#E8F5FF] border border-gray/20 px-6 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
          Start Your Journey
        </button>
        <h1 className="md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mt-2">
          Topic Overview
        </h1>
      </div>

      {/* Main Card */}
      <div className="rounded-lg overflow-hidden  max-w-7xl mx-auto p-6">
        {program && (
          <div className="flex flex-col md:flex-row gap-8 mt-5 2xl:mt-10">
            {/* Left Side - Course Cover Image */}
            {program.coverImage && (
              <div className="h-40 w-40 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  className="h-full w-full object-cover"
                  src={getImageUrl(program.coverImage)}
                  alt={program.name}
                />
              </div>
            )}

            {/* Right Side - Content */}
            <div className="items-start justify-start">
              <h2 className="md:text-lg xl:text-xl 2xl:text-2xl font-bold text-gray-900 mb-2 ">
                {program.name || "Course"}
              </h2>

              <p className="text-gray-600 mb-3 2xl:mb-3 leading-relaxed">
                {program.overview || program.description || ""}
              </p>
              <div className="mb-2">
                <h1>
                  Starting from{" "}
                  <span className="font-bold text-primary text-xl">
                    ${program.price || "TBD"}
                  </span>
                </h1>
              </div>
              {/* Rating */}
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < (program.stats?.averageRating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray/30 fill-current"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-900 font-medium mr-1">
                  {program.stats?.averageRating?.toFixed(1) || "N/A"}
                </span>
                <span className="text-gray-500">(Ratings)</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="max-w-7xl mx-auto p-2 sm:p-6 ">
        {/* Tab Navigation */}
        <div className="relative rounded-lg p-0 mb-6">
          {/* Tab Icons and Labels */}
          <div className="flex mb-8 w-full">
            <div className="flex sm:gap-8 w-full justify-evenly">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    navigate(`/overview/${id}/${tab.id}`);
                  }}
                  className={`flex flex-col items-center space-y-2 transition-all duration-300`}
                >
                  {/* Icon Circle */}
                  <div
                    className={`w-8 h-8 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                      index <= activeTab ? "bg-[#1E90FF]" : "bg-[#929292]"
                    }`}
                  >
                    {tab.active ? (
                      <RiMenuSearchLine className="text-base sm:text-3xl text-white" />
                    ) : (
                      <img src={tab.icon} className="w-4 sm:w-auto" alt="" />
                    )}
                  </div>

                  {/* Tab Title and Subtitle */}
                  <div
                    className={`text-center ${
                      index <= activeTab ? "text-[#1E90FF]" : "text-[#929292]"
                    }`}
                  >
                    <h3 className="font-semibold text-sm">{tab.title}</h3>
                    <p className="text-xs hidden sm:block text-gray-500">
                      {tab.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Moving Car */}
          <div className="relative h-10 mb-2 2xl:mb-4 w-full">
            {/* Car should be centered on the active (blue) part of the road line */}
            <div
              className="absolute transition-all duration-700 ease-in-out transform z-50 mx-auto flex items-center justify-center"
              style={{
                left: `calc(${((activeTab + 0.5) * 100) / tabs.length}% )`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="text-4xl ">
                <img src={car} className="w-10 xl:w-16" alt="" />
              </div>
            </div>

            {/* Road Line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 rounded-full z-20">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-in-out "
                style={{ width: `${((activeTab + 1) * 100) / tabs.length}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className=" rounded-lg min-h-80">
          <div className="transition-all duration-500 ease-in-out">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
