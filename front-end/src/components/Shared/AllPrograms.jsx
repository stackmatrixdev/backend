import React, { useState, useEffect } from "react";
import { BookOpen, Users } from "lucide-react";
import learning1 from "../../assets/images/learning1.png";
import learning2 from "../../assets/images/learning2.png";
import learning3 from "../../assets/images/learning3.png";
import traind from "../../assets/images/icon/traind.png";
import startd from "../../assets/images/icon/startd.png";
import trainw from "../../assets/images/icon/trainw.png";
import startw from "../../assets/images/icon/startw.png";
import { Link } from "react-router-dom";
import { programAPI, getImageUrl } from "../../services/api.service";
import toast from "react-hot-toast";

export default function AllPrograms({ limit, filters = {}, searchQuery = "" }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);

      // Build query params
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.skillLevel) params.skillLevel = filters.skillLevel;
      if (filters.duration) params.duration = filters.duration;
      if (filters.accessType) params.accessType = filters.accessType;
      if (filters.certification) params.certification = filters.certification;
      if (searchQuery) params.search = searchQuery;

      const response = await programAPI.getAll(params);

      if (response.success) {
        let programsData = response.data;

        // Apply limit if provided
        if (limit) {
          programsData = programsData.slice(0, limit);
        }

        setPrograms(programsData);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error(error.response?.data?.message || "Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  // Get background image based on category or index
  const getCategoryImage = (category, index) => {
    const images = [learning1, learning2, learning3];

    if (category?.includes("Immigration") || category?.includes("Language"))
      return learning1;
    if (category?.includes("Project") || category?.includes("Management"))
      return learning2;
    if (category?.includes("Tech") || category?.includes("Development"))
      return learning3;

    return images[index % images.length];
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-4 2xl:gap-8 max-w-6xl px-6 2xl:px-0 mx-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray/20 p-4 animate-pulse"
          >
            <div className="h-32 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="max-w-6xl px-6 mx-auto py-12 text-center">
        <p className="text-gray-600 text-lg">
          No programs found matching your criteria.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 2xl:gap-8 max-w-6xl px-6 2xl:px-0 mx-auto">
      {programs.map((program, index) => {
        // Use dynamic thumbnail from database, fallback to category-based static image
        const coverImageUrl = program.coverImage
          ? getImageUrl(program.coverImage)
          : null;
        const bgImage =
          program.thumbnail ||
          coverImageUrl ||
          getCategoryImage(program.category, index);
        const rating = program.stats?.averageRating || 4.5;
        const totalReviews = program.stats?.totalReviews || 0;
        const enrolledCount = program.stats?.enrolledUsers || 0;
        const duration = program.estimatedDuration || 1;
        const totalQuestions = program.examSimulator?.questions?.length || 0;
        const price = program.pricing?.isFree
          ? "Free"
          : `${program.pricing?.price || 19.99} ${
              program.pricing?.currency || "CAD"
            }`;

        return (
          <div
            key={program._id || index}
            className="bg-white rounded-xl border border-gray/20 hover:shadow-xl transition-shadow flex flex-col h-full"
          >
            <div className="p-4 pb-0">
              <div className="w-full h-48 overflow-hidden rounded-lg">
                <img
                  src={bgImage}
                  className="w-full h-full object-cover"
                  alt={program.name}
                  onError={(e) => {
                    e.target.src = getCategoryImage(program.category, index);
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col flex-grow p-4 pb-0">
              <h3 className="font-semibold text-lg mb-2 text-gray-800 text-center">
                {program.name}
              </h3>
              <h5 className="text-sm text-center text-gray/80">
                {program.description?.substring(0, 100)}
                {program.description?.length > 100 ? "..." : ""}
              </h5>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4 mt-4">
                <span className="flex items-center text-xs">
                  <Users className="w-4 h-4 mr-1" />
                  {Math.round(duration * 60)} mins
                </span>
                <span className="flex items-center text-xs">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {totalQuestions} questions
                </span>
                <span className="flex items-center text-xs">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {enrolledCount} learners
                </span>
              </div>
              <div className="flex justify-between items-center mb-4 text-sm">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {"★".repeat(Math.floor(rating))}
                    {rating % 1 !== 0 && "☆"}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {rating.toFixed(1)} ({totalReviews})
                  </span>
                </div>
                <div>
                  <h1>
                    Starting from{" "}
                    <span className="font-bold text-primary text-base">
                      {price}
                    </span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Push the button section to the bottom */}
            <div className="flex-grow mt-auto mb-4">
              <hr className="text-gray/50" />
              <div className="mt-4 flex justify-between items-center flex-col gap-3">
                <Link to={`/overview/${program._id}/course-overview`}>
                  <div className="p-2 bg-blue-50 hover:text-white hover:bg-gradient-to-r hover:from-[#189EFE] hover:to-[#0E5F98] rounded-lg flex items-center gap-2 group">
                    <img
                      src={traind}
                      alt="Train"
                      className="w-5 h-5 group-hover:hidden"
                    />
                    <img
                      src={trainw}
                      alt="Train Hover"
                      className="w-6 h-6 hidden group-hover:block"
                    />
                    <span>Train with LearninGPT</span>
                  </div>
                </Link>
                <Link to={`/overview/${program._id}/exam-simulator`}>
                  <div className="p-2 bg-blue-50 hover:text-white hover:bg-gradient-to-r hover:from-[#189EFE] hover:to-[#0E5F98] rounded-lg flex items-center gap-2 group">
                    <img
                      src={startd}
                      alt="Start"
                      className="w-5 h-5 group-hover:hidden"
                    />
                    <img
                      src={startw}
                      alt="Start Hover"
                      className="w-6 h-6 hidden group-hover:block"
                    />
                    <span>Start Exam Simulator</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
