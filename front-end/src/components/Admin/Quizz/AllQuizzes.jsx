import React, { useState, useEffect } from "react";
import {
  Users,
  MoreHorizontal,
  Edit3,
  Trash2,
  BookOpen,
  FolderOpen,
} from "lucide-react";
import AdminTopics from "./AdminTopics";
import { topicManagementAPI, programAPI } from "../../../services/api.service";
import toast from "react-hot-toast";

const QuizManagement = ({ handleEditQuizz }) => {
  const [topics, setTopics] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAdminTopics, setShowAdminTopics] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all", "topics", "programs"

  useEffect(() => {
    fetchTopicsAndPrograms();
  }, []);

  const fetchTopicsAndPrograms = async () => {
    setLoading(true);
    try {
      const [topicsResponse, programsResponse] = await Promise.all([
        topicManagementAPI.getAllTopics(),
        programAPI.getAll(),
      ]);

      if (topicsResponse.success) {
        setTopics(topicsResponse.data.topics || topicsResponse.data || []);
      }

      if (programsResponse.success) {
        setPrograms(programsResponse.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load topics and programs");
    } finally {
      setLoading(false);
    }
  };

  const handleBackFromAdminTopics = () => {
    setShowAdminTopics(false);
    setEditingTopic(null);
    fetchTopicsAndPrograms();
  };

  const handleEditItem = (item) => {
    if (item.itemType === "topic") {
      setEditingTopic(item);
      setShowAdminTopics(true);
      setOpenDropdown(null);
    } else {
      // For programs, redirect to edit page
      handleEditQuizz(item);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (itemToDelete) {
        if (itemToDelete.itemType === "topic") {
          await topicManagementAPI.deleteTopic(
            itemToDelete._id || itemToDelete.id
          );
          setTopics((prev) =>
            prev.filter(
              (t) => (t._id || t.id) !== (itemToDelete._id || itemToDelete.id)
            )
          );
          toast.success("Topic deleted successfully");
        } else {
          // Delete program
          await programAPI.delete(itemToDelete._id || itemToDelete.id);
          setPrograms((prev) =>
            prev.filter(
              (p) => (p._id || p.id) !== (itemToDelete._id || itemToDelete.id)
            )
          );
          toast.success("Training/Program deleted successfully");
        }
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete item");
    } finally {
      setItemToDelete(null);
      setOpenDropdown(null);
    }
  };

  const displayItems = [
    ...topics.map((topic) => ({
      ...topic,
      itemType: "topic",
      id: topic._id,
      name: topic.title,
      category: topic.category,
      questionsCount: topic.numberOfFreeQuestions || 0,
      enrolledUsers: 0,
      status: topic.isActive ? "Active" : "Inactive",
    })),
    ...programs.map((program) => ({
      ...program,
      itemType: "program",
      id: program._id,
      name: program.name || program.title,
      category: program.category,
      topic: program.topic,
      questionsCount:
        (program.examSimulator?.questions?.length || 0) +
        (program.guidedQuestions?.questions?.length || 0),
      enrolledUsers: program.stats?.enrolledUsers || 0,
      status:
        program.status === "published" && program.isActive
          ? "Active"
          : "Inactive",
    })),
  ];

  // Filter based on active tab
  const filteredItems =
    activeTab === "all"
      ? displayItems
      : displayItems.filter(
          (item) => item.itemType === activeTab.replace("s", "")
        ); // "topics" -> "topic", "programs" -> "program"

  return (
    <div className="bg-[#EAF2FF] min-h-screen drop-shadow-2xl rounded-xl">
      {showAdminTopics ? (
        <div className="w-full max-w-4xl mx-auto relative">
          <AdminTopics
            setShowAdminTopics={handleBackFromAdminTopics}
            editingTopic={editingTopic}
          />
        </div>
      ) : (
        <>
          <div className="shadow-sm">
            <div className="p-6 flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-between">
              <div className="flex flex-col items-center sm:items-start">
                <h1 className="text-2xl font-semibold text-[#1E90FF]">
                  All Topics & Programs ({filteredItems.length})
                </h1>
                <p className="text-black font-light text-base mt-1">
                  Manage your topics and training programs
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingTopic(null);
                  setShowAdminTopics(true);
                }}
                className="w-40 h-8 bg-gradient-to-r from-sky-500 to-sky-700 rounded-xl text-white text-base font-medium font-['Poppins']"
              >
                + Add Topics
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 pb-4 flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-sky-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  All ({displayItems.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab("topics")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "topics"
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Topics ({topics.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab("programs")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "programs"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Programs ({programs.length})
                </span>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No items found</p>
                <p className="text-sm mt-2">
                  {activeTab === "topics"
                    ? "Click 'Add Topics' to create your first topic"
                    : activeTab === "programs"
                    ? "Create a program from 'Create New Training' menu"
                    : "Click 'Add Topics' to get started"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto px-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#BCDFE6]">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Category
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">
                        Questions
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">
                        Enrolled Users
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-200 bg-white hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              item.itemType === "topic"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {item.itemType === "topic" ? (
                              <>
                                <FolderOpen className="w-3 h-3" /> Topic
                              </>
                            ) : (
                              <>
                                <BookOpen className="w-3 h-3" /> Program
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-[#383838] text-base">
                              {item.name}
                            </span>
                            {item.itemType === "program" && item.topic && (
                              <span className="text-sm text-gray-500">
                                Topic: {item.topic}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-700">{item.category}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <p className="text-[#5E5E5E] text-sm font-medium">
                            {item.questionsCount}
                          </p>
                          <p className="text-[#929292] text-xs">Questions</p>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-[#616161]">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {item.enrolledUsers}
                            </div>
                            <p className="text-xs text-gray-500">Users</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={
                              "px-3 py-1 rounded-full text-sm font-medium " +
                              (item.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800")
                            }
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center relative">
                          <button
                            onClick={() => toggleDropdown(item.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                          </button>
                          {openDropdown === item.id && (
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleEditItem(item)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => setItemToDelete(item)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              Delete {itemToDelete.itemType === "topic" ? "Topic" : "Program"}?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{itemToDelete.name}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
