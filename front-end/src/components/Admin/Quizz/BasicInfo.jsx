import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { topicManagementAPI, programAPI } from "../../../services/api.service";
import toast from "react-hot-toast";

export const BasicInfo = ({ basicInfo, onChange }) => {
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
        console.log("🔍 Fetching categories from API...");
        const response = await programAPI.getCategories();
        console.log("📦 Categories API response:", response);

        if (response.success && response.data && response.data.categories) {
          console.log("✅ Setting categories:", response.data.categories);
          setCategories(response.data.categories);
        } else {
          console.warn("⚠️ No categories in response");
          setCategories([]);
        }
      } catch (error) {
        console.error("❌ Failed to fetch categories:", error);
        toast.error("Failed to load categories");
        // Fallback to empty array if fetch fails
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const infoIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 512 512"
    >
      <path
        fill="#189EFE"
        d="M256 56C145.72 56 56 145.72 56 256s89.72 200 200 200s200-89.72 200-200S366.28 56 256 56m0 82a26 26 0 1 1-26 26a26 26 0 0 1 26-26m64 226H200v-32h44v-88h-32v-32h64v120h44Z"
      ></path>
    </svg>
  );

  const {
    quizTitle,
    description,
    totalMarks,
    timeLimit,
    maxAttempts,
    topic,
    category,
  } = basicInfo;

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <div className="flex items-center gap-1 mb-6">
        {infoIcon()}
        <div>
          <h2 className="text-base font-medium text-gray-900">
            Quiz Basic Information
          </h2>
          <p className="text-sm font-light text-[#BCBCBC]">
            Fill out the fundamental details of your quiz
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-extralight text-black mb-2">
            Quiz Title *
          </label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) =>
              onChange({ ...basicInfo, quizTitle: e.target.value })
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
              {(() => {
                console.log(
                  "📋 Rendering category dropdown. Categories:",
                  categories
                );
                console.log("📊 Categories length:", categories.length);
                return null;
              })()}
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
                      console.log("✅ Selected category:", categoryItem);
                      onChange({ ...basicInfo, category: categoryItem });
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
                      onChange({ ...basicInfo, topic: topicItem });
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
      </div>

      <div className="mt-6">
        <label className="block text-sm font-extralight text-black mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) =>
            onChange({ ...basicInfo, description: e.target.value })
          }
          rows={4}
          className="w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          placeholder="Enter quiz description..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div>
          <label className="block text-sm font-extralight text-black mb-2">
            Total Marks
          </label>
          <input
            type="text"
            value={totalMarks}
            onChange={(e) =>
              onChange({ ...basicInfo, totalMarks: e.target.value })
            }
            className="w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-extralight text-black mb-2">
            Time limit (minutes)
          </label>
          <select
            value={timeLimit}
            onChange={(e) =>
              onChange({ ...basicInfo, timeLimit: e.target.value })
            }
            className="w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="60">60</option>
            <option value="90">90</option>
            <option value="120">120</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-extralight text-black mb-2">
            Max attempts
          </label>
          <input
            type="number"
            value={maxAttempts}
            onChange={(e) =>
              onChange({ ...basicInfo, maxAttempts: e.target.value })
            }
            min="1"
            max="10"
            className="w-full px-3 py-2 border border-[#BCBCBC] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
