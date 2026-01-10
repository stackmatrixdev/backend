import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useTrainingCreation } from "../../../contexts/TrainingCreationContext";
import { programAPI } from "../../../services/api.service";
import toast from "react-hot-toast";

export default function QuizSettings() {
  const { state, actions } = useTrainingCreation();
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [activeStatus, setActiveStatus] = useState(true);
  const [publishedStatus, setPublishedStatus] = useState(false);
  const [paidQuiz, setPaidQuiz] = useState(false);
  const [price, setPrice] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get program ID from context
  const programId = state.creation.createdProgramId;

  // Calculate quiz summary from exam simulator
  const examSimulator = state.examSimulator;
  const totalQuestions = examSimulator.questions?.length || 0;
  const totalMarks =
    examSimulator.questions?.reduce((sum, q) => sum + (q.mark || 1), 0) || 0;
  const timeLimit = state.basicInfo.timeLimit || examSimulator.timeLimit || 30;
  const maxAttempts =
    state.basicInfo.maxAttempts || examSimulator.maxAttempts || 3;

  // Load existing settings if program exists
  useEffect(() => {
    const loadProgramSettings = async () => {
      if (programId) {
        try {
          console.log("🔍 [Settings] Loading settings for program:", programId);
          const response = await programAPI.getById(programId);

          if (response.success && response.data) {
            const program = response.data;
            console.log("✅ [Settings] Program loaded:", program);

            // Set toggle states from program
            setShuffleQuestions(
              program.examSimulator?.shuffleQuestions || false
            );
            setActiveStatus(
              program.isActive !== undefined ? program.isActive : true
            );
            setPublishedStatus(program.status === "published");
            setPaidQuiz(!program.pricing?.isFree);
            setPrice(program.pricing?.price || 0);
          }
        } catch (error) {
          console.error(
            "❌ [Settings] Failed to load program settings:",
            error
          );
        } finally {
          setLoading(false);
        }
      } else {
        // Use context settings if no program ID
        setShuffleQuestions(state.settings.shuffleQuestions || false);
        setActiveStatus(
          state.settings.isActive !== undefined ? state.settings.isActive : true
        );
        setPaidQuiz(state.settings.isPaid || false);
        setPrice(state.settings.price || 0);
        setLoading(false);
      }
    };

    loadProgramSettings();
  }, [programId, state.settings]);

  const handleSave = async () => {
    if (!programId) {
      toast.error("Please create a training first before saving settings");
      return;
    }

    setSaving(true);
    try {
      console.log("💾 [Settings] Saving settings for program:", programId);

      const settingsData = {
        isActive: activeStatus,
        status: publishedStatus ? "published" : "draft",
        pricing: {
          isFree: !paidQuiz,
          price: paidQuiz ? parseFloat(price) || 0 : 0,
          currency: "CAD",
        },
        examSimulator: {
          shuffleQuestions: shuffleQuestions,
        },
      };

      console.log("📤 [Settings] Sending settings:", settingsData);

      const response = await programAPI.update(programId, settingsData);

      console.log("📦 [Settings] Update response:", response);

      if (response.success) {
        toast.success("Settings saved successfully!");

        // Update context with new settings
        actions.updateSettings({
          shuffleQuestions,
          isActive: activeStatus,
          isPaid: paidQuiz,
          price: paidQuiz ? parseFloat(price) || 0 : 0,
        });

        console.log("✅ [Settings] Settings saved successfully");
      } else {
        toast.error(response.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("❌ [Settings] Save failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save settings";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const ToggleSwitch = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
        enabled ? "bg-black" : "bg-[#D0CECE]"
      }`}
      disabled={disabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="bg-[#B9E2FF] p-6 rounded-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Settings size={20} color="#1E90FF" />
            <h1 className="text-base font-medium text-gray-900">
              Quiz Setting
            </h1>
          </div>
          <p className="text-gray-600 ml-8 font-normal text-xs">
            Configure quiz behavior and access settings
          </p>
        </div>

        {/* Program Status Indicator */}
        {programId && (
          <div className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
            Training Created
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading settings...</p>
        </div>
      ) : (
        <>
          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Quiz Behavior */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Quiz Behavior
              </h2>
              <div className="space-y-4">
                {/* Shuffle Questions */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Shuffle Questions
                      </h3>
                      <p className="text-sm text-gray-600">
                        Randomize question order for each attempt
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={shuffleQuestions}
                      onChange={setShuffleQuestions}
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Active Status
                      </h3>
                      <p className="text-sm text-gray-600">
                        Make quiz available to students
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={activeStatus}
                      onChange={setActiveStatus}
                    />
                  </div>
                </div>

                {/* Published Status */}
                <div className="bg-white rounded-lg p-4 border border-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        Published Status
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            publishedStatus
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {publishedStatus ? "Published" : "Draft"}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600">
                        Make training visible in Explore Courses section
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={publishedStatus}
                      onChange={setPublishedStatus}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Access Control */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Access Control
              </h2>
              <div className="space-y-4">
                {/* Paid Quiz */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Paid Quiz</h3>
                      <p className="text-sm text-gray-600">
                        Require payment or subscription to access
                      </p>
                    </div>
                    <ToggleSwitch enabled={paidQuiz} onChange={setPaidQuiz} />
                  </div>

                  {/* Price Input - Only show when paid quiz is enabled */}
                  {paidQuiz && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (CAD)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Summary */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Quiz Summary
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-blue-500 font-medium mb-2">Questions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalQuestions}
                </p>
              </div>
              <div className="text-center">
                <p className="text-blue-500 font-medium mb-2">Marks</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalMarks}
                </p>
              </div>
              <div className="text-center">
                <p className="text-blue-500 font-medium mb-2">Time Limit</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {timeLimit}m
                </p>
              </div>
              <div className="text-center">
                <p className="text-blue-500 font-medium mb-2">Max Attempts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {maxAttempts}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSave}
              disabled={saving || !programId}
              className="w-80 bg-gradient-to-r from-[#189EFE] to-[#0E5F98] text-white text-base py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>

          {!programId && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Please create a training in Exam Simulator or Guided Questions tab
              first
            </p>
          )}
        </>
      )}
    </div>
  );
}
