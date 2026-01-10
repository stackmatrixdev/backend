import React, { useEffect } from 'react';
import AOS from 'aos'; // Import AOS library
import 'aos/dist/aos.css'; // Import AOS styles

import exam from "../../assets/images/exam.png";
import quiz from "../../assets/images/quiz.png";
import Button from "../Shared/Button";
import badge from "../../assets/images/chat-icon.png";
import { Link } from "react-router-dom";

const KeyFeature = () => {
  useEffect(() => {
    // Initialize AOS after the component mounts
    AOS.init({
      duration: 1000, // Set a default duration for animations
      once: true, // Animation happens once (not repeatedly when scrolling)
    });
  }, []);

  return (
    <section className="relative py-8 md:py-16 bg-gray-50 overflow-hidden">
      <div
        aria-hidden="true"
        className="hidden lg:block 
          pointer-events-none absolute
          -top-32 sm:-top-40 lg:-top-32
          -right-28 sm:-right-40 lg:-right-28
          w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[320px] lg:h-[320px]
          rounded-full border-[10px] sm:border-[12px] lg:border-[36px]
          border-circle
          z-0
        "
      />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-blue-100 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-primary">
            <div>
              <img src={badge} alt="badge" />
            </div>
            <span>Chat-Based Learning</span>
          </div>
        </div>

        <h2 className="text-xl md:text-3xl font-bold text-center mb-2 text-gray-800">
          Key Features
        </h2>
        <p className="mb-6 md:mb-12 text-center text-sm md:text-base">
          Discover our AI-powered tools designed to accelerate your learning
        </p>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8 md:max-w-4xl mx-auto">
          <div className="absolute hidden lg:block -top-20 -right-40 w-[200px] h-[200px] xl:w-[600px] xl:h-[600px] bg-gradient-to-tr from-[#C5E7FF] via-blue-50 to-transparent rounded-full blur-3xl"></div>

          {/* Card 1 */}
          <div
            data-aos="fade-up"
            data-aos-duration="1500"
            className="bg-white shadow-lg border border-blue-100 rounded-xl relative z-10"
          >
            <div className="flex items-center justify-center bg-[#B7DDFF] mx-auto rounded-t-lg py-5 md:py-10">
              <img src={quiz} alt="" />
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4 text-gray-800">
                AI Quiz Coach
              </h3>
              <p className="text-gray-600 text-sm md:text-base text-center mb-3 md:mb-6">
                Get instant help from our intelligent chatbot. Ask questions,
                clarify concepts, and receive personalized explanations.
              </p>
              <Link to={"/topics"}>
                <div className="text-center">
                  <Button padding="px-6 py-2" rounded={"lg"}>
                    Try Assistant
                  </Button>
                </div>
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div
            data-aos="fade-up"
            data-aos-duration="1500"
            data-aos-delay="200"
            className="bg-white rounded-xl shadow-lg border border-blue-100 relative z-10"
          >
            <div className="flex items-center justify-center bg-[#D1E5F8] mx-auto rounded-t-lg py-5 md:py-10">
              <img src={exam} alt="" />
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4 text-gray-800">
                Smart Exam Simulator
              </h3>
              <p className="text-gray-600 text-sm md:text-base text-center mb-3 md:mb-6">
                Practice with adaptive quizzes that adjust to your skill level.
                Track progress and identify areas for improvement.
              </p>
              <Link to={"/topics"}>
                <div className="text-center">
                  <Button padding="px-6 py-2" rounded={"lg"}>
                    Start Exam Simulator
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeature;
