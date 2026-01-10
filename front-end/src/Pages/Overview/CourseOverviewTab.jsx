import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { programAPI } from "../../services/api.service";
import toast from "react-hot-toast";

const CourseOverviewTab = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const response = await programAPI.getById(id);

      if (response.success) {
        setProgram(response.data);
      }
    } catch (error) {
      console.error("Error fetching program:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-300 rounded mb-4 w-2/3"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-300 rounded mb-8 w-3/4"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Course not found</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="p-3 sm:p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold text-secondary">
            {program.name || "Course Details"}
          </h1>
        </div>

        {/* Course Description */}
        {program.overview && (
          <div className="mb-8">
            <h2 className="font-semibold text-light mb-4">
              Course Description
            </h2>
            <div className="space-y-4 text-light">
              {program.overview.split("\n\n").map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* Description fallback if no overview */}
        {!program.overview && program.description && (
          <div className="mb-8">
            <h2 className="font-semibold text-light mb-4">
              Course Description
            </h2>
            <div className="space-y-4 text-light">
              <p>{program.description}</p>
            </div>
          </div>
        )}

        {/* Topics Covered */}
        {program.topicsCovered && program.topicsCovered.length > 0 && (
          <div className="mb-8 text-light">
            <h2 className="font-semibold mb-4">Topics include:</h2>
            <ul className="space-y-2">
              {program.topicsCovered.map((topic, idx) => (
                <li key={idx}>• {topic}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Learning Objectives */}
        {program.learningObjectives &&
          program.learningObjectives.length > 0 && (
            <div className="mb-8 text-light">
              <h2 className="font-semibold mb-4">Learning Objectives</h2>
              <ul className="space-y-2">
                {program.learningObjectives.map((objective, idx) => (
                  <li key={idx}>• {objective}</li>
                ))}
              </ul>
            </div>
          )}

        {/* Course Sections */}
        {program.courseSections && program.courseSections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              📚 Course Sections
            </h2>
            <div className="space-y-6">
              {program.courseSections
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((section, idx) => (
                  <div key={idx} className="border-l-4 border-primary pl-4">
                    <h3 className="sm:text-lg font-semibold text-gray-900 mb-3">
                      {section.order || idx + 1}. {section.title}
                    </h3>
                    {section.description && (
                      <p className="text-light mb-2">{section.description}</p>
                    )}
                    {section.topics && section.topics.length > 0 && (
                      <ul className="text-light space-y-1 ml-4 sm:ml-8 text-sm sm:text-base">
                        {section.topics.map((topic, topicIdx) => (
                          <li key={topicIdx}>• {topic}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Course Stats */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">
              {program.stats?.enrolledUsers || 0}
            </p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">
              {program.estimatedDuration || 0}
            </p>
            <p className="text-sm text-gray-600">Hours</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">
              {program.stats?.averageRating?.toFixed(1) || "N/A"}
            </p>
            <p className="text-sm text-gray-600">Rating</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">
              {program.examSimulator?.questions?.length ||
                program.guidedQuestions?.questions?.length ||
                0}
            </p>
            <p className="text-sm text-gray-600">Questions</p>
          </div>
        </div>

        {/* Documentation/Materials */}
        {program.documentation && program.documentation.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              📄 Course Materials
            </h2>
            <div className="space-y-2">
              {program.documentation.map((doc, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 p-4 rounded-lg"
                >
                  <h3 className="font-semibold">{doc.title}</h3>
                  {doc.description && (
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  )}
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm hover:underline"
                    >
                      View Document →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {program.prerequisites && program.prerequisites.length > 0 && (
          <div className="mb-8 text-light">
            <h2 className="font-semibold mb-4">Prerequisites</h2>
            <ul className="space-y-2">
              {program.prerequisites.map((prereq, idx) => (
                <li key={idx}>• {prereq}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseOverviewTab;
