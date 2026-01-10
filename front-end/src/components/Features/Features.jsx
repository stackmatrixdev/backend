import React from "react";
import { CheckCircle } from "lucide-react";
import { ScrollRestoration } from "react-router-dom";

const Features = () => {
  return (
    <div className="bg-[#F2F4F7] py-5">
      <ScrollRestoration />

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Features</h1>
        </div>

        {/* Features List */}
        <div className="space-y-8">
          {/* Feature 1 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              🧪 1. What is AI Exam Coach?
            </h2>
            <p className="text-gray-700 ml-7">
              It Is A Smart Assistant For Exam Prep That Combines Structured
              Courses With An AI-Powered Assistant To Help You Practice Exams
              And Understand Your Mistakes—So You Can Study Smarter, Not Harder.
            </p>
          </div>

          {/* Feature 2 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              📚 2. How is this different from a regular quiz app?{" "}
            </h2>
            <p className="text-gray-700 ml-7">
              Unlike Traditional Quiz Apps, AI Exam Coach Not Only Lets You Take
              Quizzes But Also Gives You Instant Feedback And Explanations Using
              An Interactive AI Chat Assistant.
            </p>
          </div>

          {/* Feature 3 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              🤖 3. What can the AI Assistant do?{" "}
            </h2>
            <div className="text-gray-700 ml-7">
              <p className="mb-3">The AI Assistant Helps You:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Understand Why Your Answer Is Correct Or Incorrect</li>
                <li>Break Down Tough Questions</li>
                <li>Provide Learning Tips Based On Your Performance</li>
                <li>Suggest Resources For Improvement</li>
              </ul>
            </div>
          </div>

          {/* Feature 4 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              🔐 4. Does the AI give out answers directly?{" "}
            </h2>
            <p className="text-gray-700 ml-7">
              No, Our AI Is Designed To Coach You—Not Cheat For You. It Helps
              You Reason Through Questions Rather Than Giving Away The Correct
              Choice.
            </p>
          </div>

          {/* Feature 5 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              📝 5. What types of quizzes are available?{" "}
            </h2>
            <div className="text-gray-700 ml-7">
              <p className="mb-3">You Can Take:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Mock Exams</li>
                <li>Topic-Specific Quizzes</li>
                <li>Custom Quizzes Based On Difficulty Or Subject</li>
              </ul>
            </div>
          </div>

          {/* Feature 6 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              📈 6. Can I track my progress?{" "}
            </h2>
            <div className="text-gray-700 ml-7">
              <p className="mb-3">Yes! Your Dashboard Shows:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Quiz History And Scores</li>
                <li>Time Spent Per Quiz</li>
                <li>Improvement Over Time</li>
                <li>Personalized Feedback From The AI Assistant</li>
              </ul>
            </div>
          </div>

          {/* Feature 7 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              📱 7. Is there a mobile app?{" "}
            </h2>
            <p className="text-gray-700 ml-7">
              Yes, AI Exam Coach Is Available As A Responsive Web App And Also
              As A Companion Mobile App For IOS And Android.
            </p>
          </div>

          {/* Feature 8 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              🧑‍💻 8. Can I upload my own quiz questions?{" "}
            </h2>
            <p className="text-gray-700 ml-7">
              Currently, AI Exam Coach Has Curated Content, But We're Working On
              Our Built-In Interface—No Coding Required!
            </p>
          </div>

          {/* Feature 9 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              💰 9. Is it free to use?{" "}
            </h2>
            <div className="text-gray-700 ml-7">
              <p className="mb-3">We Offer:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>A Free Basic Plan With Limited Quizzes And AI Chats</li>
                <li>
                  A Premium Plan With Unlimited Quizzes, Detailed Performance
                  Tracking, And Full AI Assistance
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 10 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              🧠 10. Which AI model do you use?{" "}
            </h2>
            <p className="text-gray-700 ml-7">
              We Use Powerful Open-Source AI Models Like Mistral Or GPT-J,
              Ensuring Cost-Effective And Privacy-Conscious Learning Support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
