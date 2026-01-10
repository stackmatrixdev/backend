import React, { useEffect, useState } from "react";
import ModeSelection from "../../components/ModeSelection";
import GuidedDashboard from "../Dashboard/GuidedDashboard";
import Dashboard from "../Dashboard/Dashboard";
import { useLocation, useParams } from "react-router-dom";
function AiCoachTab() {
  const location = useLocation();
  const { id } = useParams();
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  useEffect(() => {
    // If navigated with state.skill (from QuizResult), pre-select skill level
    const skill = location?.state?.skill;
    if (skill) {
      setSelectedSkillLevel(skill);
      setSelectedMode(""); // ensure mode step shows next
      // clear transient history state so re-entering doesn't retrigger
      try {
        window.history.replaceState(null, "", location.pathname);
      } catch {
        // noop
      }
    }
  }, [location]);
  const handleSkillLevelSelect = (level) => {
    setSelectedSkillLevel(level);
    setSelectedMode("");
  };
  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setSelectedSkillLevel("");
  };
  return (
    <div className="bg-gray-50 flex items-center justify-center md:p-6">
      {selectedSkillLevel && !selectedMode ? (
        <ModeSelection handleModeSelect={handleModeSelect} />
      ) : selectedMode ? (
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">LearninGPT Assistant</h2>
          <p className="text-gray mb-8">
            Ask questions about the course material. 3 free messages remaining.
          </p>
          {selectedMode === "Guided Learning Path" ? (
            <GuidedDashboard embedded={true} programId={id} />
          ) : (
            <Dashboard tab={true} embedded={true} programId={id} />
          )}
        </div>
      ) : (
        <div className="max-w-4xl w-full">
          <div className="border-2 border-blue-400 rounded-lg p-6 md:p-12">
            <div className="text-center md:mb-12 mb-6">
              <p className="text-gray-800 text-lg">
                Before we begin, choose your expertise level so the AI Coach can
                better guide you.
              </p>
            </div>
            <div className="text-center mb-6 md:mb-12">
              <h2 className="text-2xl font-semibold text-gray-900">
                Skill level
              </h2>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-center md:space-x-8">
              <button
                onClick={() => handleSkillLevelSelect("Beginner")}
                className="bg-blue-100 text-blue-800 px-8 py-2 rounded-lg border border-blue-200 hover:bg-blue-200 transition-colors font-medium min-w-[120px]"
              >
                Beginner
              </button>
              <button
                onClick={() => handleSkillLevelSelect("Intermediate")}
                className="bg-blue-100 text-blue-800 px-8 py-2 rounded-lg border border-blue-200 hover:bg-blue-200 transition-colors font-medium min-w-[120px]"
              >
                Intermediate
              </button>
              <button
                onClick={() => handleSkillLevelSelect("Advance")}
                className="bg-blue-100 text-blue-800 px-8 py-2 rounded-lg border border-blue-200 hover:bg-blue-200 transition-colors font-medium min-w-[120px]"
              >
                Advance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiCoachTab;
