import React, { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

const FilterBar = ({ onFilterChange, totalResults = 0 }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    category: null,
    skillLevel: null,
    duration: null,
    accessType: null,
    certification: null,
  });

  // Notify parent component when filters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  }, [selectedFilters, onFilterChange]);

  const toggleDropdown = (filterName) => {
    setOpenDropdown(openDropdown === filterName ? null : filterName);
  };

  const selectFilter = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setOpenDropdown(null);
  };

  const clearFilter = (filterType) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: null,
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      category: null,
      skillLevel: null,
      duration: null,
      accessType: null,
      certification: null,
    });
  };

  const filters = {
    category: {
      label: "Category",
      options: [
        "Immigration & Language Preparation",
        "Project Management",
        "Tech & Development",
        "Office Tools",
        "Office Productivity",
        "Personal Development",
      ],
    },
    skillLevel: {
      label: "Skill Level",
      options: ["Beginner", "Intermediate", "Advanced"],
    },
    duration: {
      label: "Duration",
      options: ["Less than 30 min", "30 to 60 min", "More than 60 min"],
    },
    accessType: {
      label: "Access Type",
      options: [
        "Free Preview Available",
        "AI Coach Only",
        "Exam Simulator Only",
        "Full Access",
      ],
    },
    certification: {
      label: "Certification",
      options: ["Yes", "No"],
    },
  };

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).filter((value) => value !== null)
      .length;
  };

  return (
    <div className="bg-white border-y border-gray/50 py-4">
      <div className="flex flex-col w-10/12 mx-auto">
        <div className="flex items-center justify-between w-full">
          {/* Filters Label */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          {/* Results Count */}
          <div className="ml-auto text-sm text-gray-500">
            {totalResults} Course{totalResults !== 1 ? "s" : ""} found
          </div>
        </div>
        {/* Filter Dropdowns */}
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-10 my-4">
          {Object.entries(filters).map(([filterKey, filter]) => (
            <div key={filterKey} className="relative">
              <button
                onClick={() => toggleDropdown(filterKey)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm border border-gray/50 rounded-sm transition-colors ${
                  selectedFilters[filterKey]
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                <span>{selectedFilters[filterKey] || filter.label}</span>
                {selectedFilters[filterKey] && (
                  <X
                    className="w-3 h-3 ml-1 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFilter(filterKey);
                    }}
                  />
                )}
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {openDropdown === filterKey && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-2 max-h-60 overflow-y-auto">
                    {filter.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => selectFilter(filterKey, option)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          selectedFilters[filterKey] === option
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Clear All Button */}
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
};

export default FilterBar;
