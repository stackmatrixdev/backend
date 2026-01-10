import React, { useState } from "react";
import icon from "../../assets/images/about.png";
import image from "../../assets/images/aboutImg.png";
const AboutSection = () => {
  const [activeTab, setActiveTab] = useState("mission");

  const getContent = () => {
    switch (activeTab) {
      case "mission":
        return {
          title: "Our Mission",
          text: "Dictumst hendrerit velinunc justo. pulvinar massa diam vitae. Montes, orci fringilla maecenas tellus in convallis sed id. Sed ut commodo risus aenean. Quam consectetur ut vulputate ultrices diam.",
        };
      case "vision":
        return {
          title: "Our Vision",
          text: "Dictumst hendrerit velinunc justo. pulvinar massa diam vitae. Montes, orci fringilla maecenas tellus in convallis sed id. Sed ut commodo risus aenean. Quam consectetur ut vulputate ultrices diam.",
        };
      case "goal":
        return {
          title: "Our Goal",
          text: "Dictumst hendrerit velinunc justo. pulvinar massa diam vitae. Montes, orci fringilla maecenas tellus in convallis sed id. Sed ut commodo risus aenean. Quam consectetur ut vulputate ultrices diam.",
        };
      default:
        return {
          title: "Our Mission",
          text: "Dictumst hendrerit velinunc justo. pulvinar massa diam vitae. Montes, orci fringilla maecenas tellus in convallis sed id. Sed ut commodo risus aenean. Quam consectetur ut vulputate ultrices diam.",
        };
    }
  };

  const { title, text } = getContent();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-around md:p-6 bg-gray-100 2xl:w-10/12 mx-auto mt-10">
      {/* Image Placeholder 1 */}
      <div className="bg-gray-300 rounded-lg overflow-hidden">
        <img
          src={image}
          alt="Placeholder 1"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info Card */}
      <div className="bg-white p-6 rounded-lg md:shadow-lg w-full xl:w-[40%] 2xl:w-1/3 mt-6 md:mt-0">
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-blue-100 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-primary">
              <div>
                <img src={icon} alt="badge" />
              </div>
              <span>About</span>
            </div>
          </div>{" "}
        </div>
        <p className="text-lg font-semibold mb-4">
          Over  <span className="text-primary mr-1">15,000+</span> online
          Quizzes <span className="text-primary mr-1">500+</span> from best
          instructor
        </p>
        <div className="flex space-x-4 mb-4">
          <button
            className={`bg-blue-500 text-white px-2 2xl:px-4 py-2 rounded-full ${
              activeTab === "mission" ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setActiveTab("mission")}
          >
            Our Mission
          </button>
          <button
            className={`bg-blue-500 text-white px-2 2xl:px-4 py-2 rounded-full ${
              activeTab === "vision" ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setActiveTab("vision")}
          >
            Our Vision
          </button>
          <button
            className={`bg-blue-500 text-white px-2 2xl:px-4 py-2 rounded-full ${
              activeTab === "goal" ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => setActiveTab("goal")}
          >
            Our Goal
          </button>
        </div>
        <p className="text-gray/90 mb-4">{text}</p>
        <ul className="list-decimal list-inside text-gray-600">
          <li>Quality Content and Expert Instruction</li>
          <li>Quality Content and Expert Instruction</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutSection;
