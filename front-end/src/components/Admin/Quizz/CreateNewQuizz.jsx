import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Settings,
  Eye,
  HelpCircle,
  Blocks,
} from "lucide-react";
import { QuestionsContent } from "./QuestionsContent";
import QuizSettings from "./QuizSettings";
import QuizPreview from "./Preview";
import { Document } from "./Document";
import { GuidedQuesitons } from "./GuidedQuestions/GuidedQuesitons";
import { TrainingCreationProvider } from "../../../contexts/TrainingCreationContext";
import { useTrainingCreation } from "../../../hooks/useTrainingCreation";

const QuizCreatorContent = ({ setShowBasicInfo }) => {
  const { state, actions } = useTrainingCreation();
  const [activeTab, setActiveTab] = useState("exam");

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    actions.setCurrentStep(tabId);
  };

  const tabs = [
    { id: "exam", label: "Exam Simulator", icon: <Blocks size={18} /> },
    {
      id: "guidedQuestions",
      label: "Guided Questions",
      icon: <HelpCircle size={18} />,
    },
    { id: "document", label: "Document", icon: <FileText size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
    { id: "preview", label: "Preview", icon: <Eye size={18} /> },
  ];

  return (
    <div className="py-6">
      <div className="px-7 flex flex-col md:flex-row gap-5 md:gap-0 justify-between items-center pb-12">
        <div className="flex flex-col md:flex-row items-center gap-5 md:gap-14 cursor-pointer">
          <div
            onClick={() => {
              setShowBasicInfo(false);
            }}
            className="flex items-center text-black cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Back to Quizzes</span>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-medium text-[#1E90FF]">
              Create New Training
            </h1>
            <p className="text-sm text-[#929292]">
              Build comprehensive quizzes with multiple question types
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        {state.creation.createdProgramId && (
          <div className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
            Training Created Successfully
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-6 drop-shadow-md rounded-lg bg-white px-6 py-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium
              ${
                activeTab === tab.id
                  ? "bg-[#1E90FF] text-white"
                  : "text-gray-600 hover:text-[#1E90FF]"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-12 drop-shadow-md">
        {activeTab === "exam" && <QuestionsContent />}
        {activeTab === "guidedQuestions" && <GuidedQuesitons />}
        {activeTab === "document" && (
          <Document programId={state.creation.createdProgramId} />
        )}
        {activeTab === "settings" && <QuizSettings />}
        {activeTab === "preview" && <QuizPreview />}
      </div>
    </div>
  );
};

export default function QuizCreator({ setShowBasicInfo }) {
  return (
    <TrainingCreationProvider>
      <QuizCreatorContent setShowBasicInfo={setShowBasicInfo} />
    </TrainingCreationProvider>
  );
}
