import { useState } from 'react';
import { ChevronDown, Settings, Eye} from 'lucide-react';

export default function QuizCreator() {
  // Settings states
  const [settings, setSettings] = useState({
    shuffleQuestions: false,
    poolOut: true,
    activeStatus: true
  });
  
  // Modal states
  const [showSelectModal, setShowSelectModal] = useState(false);

  const renderDocument = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
            3
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Documents Upload</h2>
            <p className="text-sm text-gray-500">Set up the fundamental details of your quiz</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Enter document title..."
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>
            <button className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white text-left flex items-center justify-between text-gray-400">
              <span>Select topic...</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Upload Documents</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Choose File
              </button>
              <p className="text-sm text-gray-500 mt-2">No file chosen</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Information</label>
            <textarea
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="Enter document information..."
            />
          </div>

          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-blue-100 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Settings className="w-6 h-6 mr-3 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Quiz Settings</h2>
            <p className="text-sm text-gray-500">Configure quiz behavior and access settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Quiz Behavior</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Shuffle Questions</p>
                  <p className="text-xs text-gray-500">Randomize question order for each attempt</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.shuffleQuestions}
                    onChange={(e) => setSettings({...settings, shuffleQuestions: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Active Status</p>
                  <p className="text-xs text-gray-500">Make quiz available to students</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.activeStatus}
                    onChange={(e) => setSettings({...settings, activeStatus: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Access Control</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Pool Out</p>
                  <p className="text-xs text-gray-500">Require payment or subscription to access</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.poolOut}
                    onChange={(e) => setSettings({...settings, poolOut: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Quiz Summary</h3>
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-sm font-medium text-gray-700">Questions</p>
              <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Marks</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Time Limit</p>
              <p className="text-2xl font-bold text-gray-900">{timeLimit}m</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Max Attempts</p>
              <p className="text-2xl font-bold text-gray-900">{maxAttempts}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-6">
          <Eye className="w-6 h-6 mr-3 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Quiz Preview</h2>
            <p className="text-sm text-gray-500">Preview quiz as will appear to students</p>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Development Quiz</h3>
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
              <span className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                30 minutes
              </span>
              <span className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                1 marks
              </span>
              <span className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                1 questions
              </span>
            </div>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <div key={question.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold mr-2">
                      Question {qIndex + 1}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium mb-4">{question.text}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className={`flex items-center p-3 rounded-lg border ${
                        oIndex === question.correctAnswer ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-3 ${
                          oIndex === 0 ? 'bg-blue-500' : 
                          oIndex === 1 ? 'bg-orange-500' : 
                          oIndex === 2 ? 'bg-green-500' : 'bg-purple-500'
                        }`}>
                          {String.fromCharCode(65 + oIndex)}
                        </div>
                        <span className="text-sm text-gray-700">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
