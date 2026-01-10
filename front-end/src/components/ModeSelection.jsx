import free from "../assets/images/free.png";
import guided from "../assets/images/guided.png";

export default function ModeSelection({ handleModeSelect }) {
  return (
    <div className="bg-gray-50 flex items-center justify-center md:p-6 p-3">
      <div className="max-w-4xl w-full">
        <div className=" border border-gray-300 p-6 md:p-12">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Choose Your Mode
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Guided Learning Path */}
            <div className=" rounded-lg shadow-lg overflow-hidden">
              <div className="bg-[#B7DDFF] py-6 relative flex items-center justify-center">
                <img src={free} alt="" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Guided Learning Path
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Start here for a structured and faster learning experience.
                </p>
                <button
                  onClick={() => handleModeSelect("Guided Learning Path")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                >
                  Start Guide Path
                </button>
              </div>
            </div>

            {/* Free Questions */}
            <div className=" rounded-lg shadow-lg overflow-hidden">
              <div className="bg-[#D1E5F8] py-6 relative flex items-center justify-center">
                <img src={guided} alt="" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Free Questions
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Ask anything. One credit per question. Personalized answers
                  powered by AI.
                </p>
                <button
                  onClick={() => handleModeSelect("Free Questions")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                >
                  Start Free Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
