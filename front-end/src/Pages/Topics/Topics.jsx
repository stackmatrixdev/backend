import React, { useState, useEffect } from "react";
import FilterBar from "./FilterBar";
import AllPrograms from "../../components/Shared/AllPrograms";
import { Search } from "lucide-react";
import { ScrollRestoration } from "react-router-dom";
import { programAPI } from "../../services/api.service";

export default function Topics() {
  const [filters, setFilters] = useState({
    category: null,
    skillLevel: null,
    duration: null,
    accessType: null,
    certification: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState(0);

  // Fetch total results count when filters/search change
  useEffect(() => {
    fetchTotalResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery]);

  const fetchTotalResults = async () => {
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.skillLevel) params.skillLevel = filters.skillLevel;
      if (filters.duration) params.duration = filters.duration;
      if (filters.accessType) params.accessType = filters.accessType;
      if (filters.certification) params.certification = filters.certification;
      if (searchQuery) params.search = searchQuery;

      const response = await programAPI.getAll(params);
      if (response.success) {
        setTotalResults(response.data.length);
      }
    } catch (error) {
      console.error("Error fetching total results:", error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <ScrollRestoration />
      <FilterBar
        onFilterChange={handleFilterChange}
        totalResults={totalResults}
      />
      {/* heading... */}
      <div className="flex flex-col items-center justify-center px-4 bg-[#F4F8FD] py-5 2xl:py-10">
        {/* Top Button */}
        <button className="bg-[#E8F5FF] border border-gray/20 px-6 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
          Start Your Journey
        </button>

        {/* Heading */}
        <h2 className="text-xl md:text-3xl 2xl:text-4xl font-bold text-center text-[#0A2149] my-3 2xl:my-6">
          Our Learning Programs
        </h2>

        {/* Search Box */}
        <div className="w-full max-w-md px-2 relative">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray/80"
            size={20}
          />
          <input
            type="text"
            placeholder="Search Course"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 2xl:py-3 border border-gray/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray/80"
          />
        </div>
      </div>
      <div className="bg-[#F4F8FD] pb-10">
        <AllPrograms filters={filters} searchQuery={searchQuery} />
      </div>
    </div>
  );
}
