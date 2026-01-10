import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdOutlineExplore } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import tech from "../../assets/images/techno.png";
import book from "../../assets/images/book.png";
import arrow from "../../assets/images/arrow.png";
import watch from "../../assets/images/watch.png";
import score from "../../assets/images/score.png";
import create from "../../assets/images/icon/create.png";
import join from "../../assets/images/icon/join.png";
import createw from "../../assets/images/icon/createw.png";
import joinw from "../../assets/images/icon/joinw.png";
import Aos from "aos";
// import "aos/dist/aos.css"; // Import AOS styles

const TopFeatures = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [currentProgress, setCurrentProgress] = useState(65);
  const [allTimeScore, setAllTimeScore] = useState(0);

  const features = [
    {
      title: "Track Your Progress",
      description: "See your growth over time with personalized stats",
      buttonText: "Create Free Account",
      image: arrow,
      icon: <FaRegUser className="" />,
      go: "/register",
    },
    {
      title: "Practice Smarter",
      description: "Get instant feedback and AI coaching",
      buttonText: "Explore Features",
      image: tech,
      icon: <MdOutlineExplore className="text-xl" />,
      go: "/topics",
    },
    {
      title: "Start Learning Today",
      description: "Begin your journey in seconds",
      buttonText: "Join Now",
      image: book,
      icons: join,
      go: "/topics",
    },
  ];

  // Initialize AOS
  useEffect(() => {
    Aos.init({
      duration: 1000, // Duration for the animation
      once: true, // Animation happens only once
    });
  }, []);

  return (
    <section className="py-12 bg-[#F9FAFB]">
      {isAuthenticated ? (
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Today's Progress Card */}
            <div
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="100"
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Today's Progress
                </h3>
              </div>

              <div className="mb-4">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  JavaScript Fundamentals
                </h4>
                {/* Progress Bar */}
                <div className="w-full h-3 flex rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-[#189EFE] to-[#0E5F98]"
                    style={{ width: "65%" }}
                  ></div>
                  <div className="h-3 bg-gray/50" style={{ width: "35%" }}></div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {currentProgress}% complete • 3 lessons remaining
                </p>

                <p className="bg-[#E2F3FF] px-4 py-2 rounded-md inline text-center font-semibold">
                  Continue Learning
                </p>
              </div>
            </div>

            {/* All-Time Score Card */}
            <div
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-center gap-4 items-center"
            >
              <div className="flex items-center justify-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  All-Time Score
                </h3>
              </div>

              <div className="text-center flex items-center justify-center space-x-10">
                <img src={score} alt="" />

                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {allTimeScore.toString().padStart(2, "0")}
                  </div>

                  <p className="text-sm text-gray-600">Total points earned</p>
                </div>
              </div>
            </div>

            {/* Start Quiz Card */}
            <div
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="300"
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center gap-6"
            >
              <img src={watch} alt="" />
              <p className="bg-[#E2F3FF] px-4 py-3 rounded-md w-9/12 text-center font-bold text-xl">
                Start Quiz
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay={index * 200} // Stagger the animations based on index
                className="bg-white rounded-xl p-2 border border-gray/20 shadow-lg px-4 text-center flex flex-col items-center"
              >
                <img src={feature.image} alt="" />

                <h3 className="font-semibold text-lg my-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 w-3/5 leading-relaxed">
                  {feature.description}
                </p>

                <Link to={feature.go}>
                  <div className="flex-grow">
                    <button
                      className={`bg-primary/10 items-center hover:bg-gradient-to-r hover:from-[#189EFE] hover:to-[#0E5F98] hover:text-white text-black px-6 py-2 flex rounded-lg gap-2 text-sm font-medium transition-colors group`}
                    >
                      {feature.icon ? (
                        feature.icon
                      ) : (
                        <>
                          {feature.buttonText === "Create Free Account" ? (
                            <>
                              <img
                                src={create}
                                alt="Create"
                                className="w-6 h-6 group-hover:hidden"
                              />
                              <img
                                src={createw}
                                alt="Create Hover"
                                className="w-6 h-6 hidden group-hover:block"
                              />
                            </>
                          ) : feature.buttonText === "Join Now" ? (
                            <>
                              <img
                                src={join}
                                alt="Join"
                                className="w-6 h-6 group-hover:hidden"
                              />
                              <img
                                src={joinw}
                                alt="Join Hover"
                                className="w-6 h-6 hidden group-hover:block"
                              />
                            </>
                          ) : null}
                        </>
                      )}
                      {feature.buttonText}
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TopFeatures;
