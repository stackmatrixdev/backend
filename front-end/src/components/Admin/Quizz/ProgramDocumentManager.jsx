import { useState, useEffect } from "react";
import { Book, FileText, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { programAPI } from "../../../services/api.service";
import { ProgramDocuments } from "./ProgramDocuments";

export const ProgramDocumentManager = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await programAPI.getAllPrograms();
      if (response.success) {
        setPrograms(response.data || []);
      } else {
        toast.error("Failed to load programs");
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error);
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  if (selectedProgram) {
    return (
      <div className="space-y-4">
        {/* Back button */}
        <button
          onClick={() => setSelectedProgram(null)}
          className="text-blue-500 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Back to Programs
        </button>

        {/* Selected program info */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <Book className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedProgram.title || selectedProgram.name}
              </h2>
              <p className="text-sm text-gray-600">
                Managing documents for this program
              </p>
            </div>
          </div>
        </div>

        {/* Document management component */}
        <ProgramDocuments programId={selectedProgram._id} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Program Document Management
        </h2>
        <p className="text-gray-600">
          Select a program to manage its documents (free and premium content)
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading programs...</p>
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No programs found. Create a program first to add documents.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program) => (
            <button
              key={program._id}
              onClick={() => setSelectedProgram(program)}
              className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-blue-500" />
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                    {program.title || program.name}
                  </h3>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
              </div>

              {program.topic && (
                <p className="text-sm text-gray-600 mb-2">
                  Topic: {program.topic}
                </p>
              )}

              {program.category && (
                <p className="text-sm text-gray-600 mb-2">
                  Category: {program.category}
                </p>
              )}

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>
                    {(program.documentation?.free?.length || 0) +
                      (program.documentation?.premium?.length || 0)}{" "}
                    documents
                  </span>
                </div>
                {program.status && (
                  <span
                    className={`px-2 py-1 rounded ${
                      program.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {program.status}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramDocumentManager;
