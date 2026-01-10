import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
  topicManagementAPI,
  programAPI,
} from "../../../../services/api.service";
import toast from "react-hot-toast";

export const FakeChatbot = ({ fakeChatbot, onChange }) => {
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch topics from backend on mount
  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const response = await topicManagementAPI.getAllTopics();
        if (response.success && response.data) {
          // Extract topic titles from the response
          const topicTitles = response.data.map((topic) => topic.title);
          setTopics(topicTitles);
        }
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        toast.error("Failed to load topics");
        // Fallback to empty array if fetch fails
        setTopics([]);
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, []);

  // Fetch categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        console.log("🔍 [GuidedQuestions] Fetching categories from API...");
        const response = await programAPI.getCategories();
        console.log("📦 [GuidedQuestions] Categories API response:", response);

        if (response.success && response.data && response.data.categories) {
          console.log(
            "✅ [GuidedQuestions] Setting categories:",
            response.data.categories
          );
          setCategories(response.data.categories);
        } else {
          console.warn("⚠️ [GuidedQuestions] No categories in response");
          setCategories([]);
        }
      } catch (error) {
        console.error(
          "❌ [GuidedQuestions] Failed to fetch categories:",
          error
        );
        toast.error("Failed to load categories");
        // Fallback to empty array if fetch fails
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const { quizTitle, freeAttempts, topic, category } = fakeChatbot;

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-extralight text-black mb-2">
            Quiz Title *
          </label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) =>
              onChange({ ...fakeChatbot, quizTitle: e.target.value })
            }
            className="w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Enter quiz title..."
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <label className="block text-sm font-extralight text-black mb-2">
            Category *
          </label>
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            disabled={loadingCategories}
            className="w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white text-left flex items-center justify-between disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            <span className={category ? "text-gray-900" : "text-gray-400"}>
              {loadingCategories
                ? "Loading categories..."
                : category || "Select category..."}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                showCategoryDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#BCBCBC] rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto">
              {categories.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  No categories available.
                </div>
              ) : (
                categories.map((categoryItem, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onChange({ ...fakeChatbot, category: categoryItem });
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors text-sm"
                  >
                    {categoryItem}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Topic Dropdown */}
        <div className="relative">
          <label className="block text-sm font-extralight text-black mb-2">
            Topic *
          </label>
          <button
            type="button"
            onClick={() => setShowTopicDropdown(!showTopicDropdown)}
            disabled={loadingTopics}
            className="w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white text-left flex items-center justify-between disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            <span className={topic ? "text-gray-900" : "text-gray-400"}>
              {loadingTopics ? "Loading topics..." : topic || "Select topic..."}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                showTopicDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showTopicDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#BCBCBC] rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto">
              {topics.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  No topics available. Please create a topic first.
                </div>
              ) : (
                topics.map((topicItem, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onChange({ ...fakeChatbot, topic: topicItem });
                      setShowTopicDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors text-sm"
                  >
                    {topicItem}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-extralight text-black mb-2">
            Free attempts
          </label>
          <input
            type="number"
            value={freeAttempts}
            onChange={(e) =>
              onChange({ ...fakeChatbot, freeAttempts: e.target.value })
            }
            min="1"
            max="10"
            className="w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>{" "}
    </div>
  );
};
