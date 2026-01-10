import icon from "../../assets/images/learners.png";
import Button from "../Shared/Button";
import { BookOpen, Users } from "lucide-react";
import learning1 from "../../assets/images/learning1.png";
import learning2 from "../../assets/images/learning2.png";
import learning3 from "../../assets/images/learning3.png";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import traind from "../../assets/images/icon/traind.png";
import startd from "../../assets/images/icon/startd.png";
import trainw from "../../assets/images/icon/trainw.png";
import startw from "../../assets/images/icon/startw.png";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS styles
const LearningPrograms = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration for the animation
      once: true, // Animation happens only once
    });
  }, []);
  const programs = [
    {
      bg: learning1,
      title: "Immigration & Language Preparation",
      subtitle:
        "Master language skills, ace your exams, and get expert guidance for a smooth immigration journey.",
      image: "/api/placeholder/300/200",
      rating: 4.8,
      students: "2.5k students",
      lessons: "45 lessons",
      color: "bg-blue-500",
      time: "90 mins",
      questions: "150 questions",
      learners: "2.5k learners",
    },
    {
      bg: learning2,
      title: "Project Management",
      subtitle:
        "Our courses help you handle real-world projects using proven frameworks like Scrum and PMP.",
      image: "/api/placeholder/300/200",
      rating: 4.9,
      students: "3.2k students",
      lessons: "52 lessons",
      color: "bg-green-500",
      time: "90 mins",
      questions: "150 questions",
      learners: "2.5k learners",
    },
    {
      bg: learning3,
      title: "Tech & Development",
      subtitle:
        "Master language skills, ace your exams, and get expert guidance for a smooth immigration journey.",
      image: "/api/placeholder/300/200",
      rating: 4.7,
      students: "1.8k students",
      lessons: "38 lessons",
      color: "bg-purple-500",
      time: "90 mins",
      questions: "150 questions",
      learners: "2.5k learners",
    },
    {
      bg: learning1,
      title: "Immigration & Language Preparation",
      subtitle:
        "Master language skills, ace your exams, and get expert guidance for a smooth immigration journey.",
      image: "/api/placeholder/300/200",
      rating: 4.8,
      students: "2.5k students",
      lessons: "45 lessons",
      color: "bg-blue-500",
      time: "90 mins",
      questions: "150 questions",
      learners: "2.5k learners",
    },
    {
      bg: learning2,
      title: "Project Management",
      subtitle:
        "Our courses help you handle real-world projects using proven frameworks like Scrum and PMP.",
      image: "/api/placeholder/300/200",
      rating: 4.9,
      students: "3.2k students",
      lessons: "52 lessons",
      color: "bg-green-500",
      time: "90 mins",
      questions: "150 questions",
      learners: "2.5k learners",
    },
    {
      bg: learning3,
      title: "Tech & Development",
      subtitle:
        "Master language skills, ace your exams, and get expert guidance for a smooth immigration journey.",
      image: "/api/placeholder/300/200",
      rating: 4.7,
      students: "1.8k students",
      lessons: "38 lessons",
      color: "bg-purple-500",
      time: "90 mins",
      questions: "150 questions",
      learners: "2.5k learners",
    },
    {
      bg: learning1,
      title: "Immigration & Language Preparation",
      subtitle:
        "Master language skills, ace your exams, and get expert guidance for a smooth immigration journey.",
      image: "/api/placeholder/300/200",
      rating: 4.8,
      students: "2.5k students",
      lessons: "45 lessons",
      color: "bg-blue-500",
      time: "90 mins",
      questions: "150 questions",
      learners: "2.5k learners",
    },
    {
      bg: learning2,
      title: "Project Management",
      subtitle:
        "Our courses help you handle real-world projects using proven frameworks like Scrum and PMP.",
      image: "/api/placeholder/300/200",
      rating: 4.9,
      students: "3.2k students",
      lessons: "52 lessons",
      color: "bg-green-500",
      time: "90 mins",
      questions: "150 questions",
      learners: "2.5k learners",
    },
    {
      bg: learning3,
      title: "Tech & Development",
      subtitle:
        "Master language skills, ace your exams, and get expert guidance for a smooth immigration journey.",
      image: "/api/placeholder/300/200",
      rating: 4.7,
      students: "1.8k students",
      lessons: "38 lessons",
      color: "bg-purple-500",
      time: "90 mins",
      questions: "150 questions",
      learners: "2.5k learners",
    },
  ];
  const infinitePrograms = [...programs, ...programs, ...programs, ...programs];
  const [screenSize, setScreenSize] = useState("desktop");
  const totalSlides = Math.ceil(programs.length / 3);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setScreenSize("mobile");
      } else if (window.innerWidth <= 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    // Call handleResize once when the component is mounted
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // --- Update auto-slide logic to use intervalRef ---
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isAnimating) {
        setCurrentSlide((prev) => (prev + 1) % (totalSlides * 3));
      }
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [totalSlides, isAnimating]);

  // --- Helper to restart interval ---
  const restartInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (totalSlides * 3));
    }, 3000); // Always 3 seconds
  };

  // --- Manual navigation handlers ---
  const handleNextSlide = () => {
    clearInterval(intervalRef.current);
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % (totalSlides * 3));
    setTimeout(() => {
      setIsAnimating(false);
      restartInterval();
    }, 500);
  };

  const handlePrevSlide = () => {
    clearInterval(intervalRef.current);
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + totalSlides * 3) % (totalSlides * 3));
    setTimeout(() => {
      setIsAnimating(false);
      restartInterval();
    }, 500);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      if (prev >= totalSlides * 2) {
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-6 relative">
        <div className="flex justify-center mb-3 md:mb-6">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-blue-100 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-primary">
            <div>
              <img src={icon} className="w-8" alt="badge" />
            </div>
            <span>Learners Trained</span>
            <span className="text-primary font-bold">2,000+</span>
          </div>
        </div>
        <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-2">
          Our Learning Programs
        </h2>
        <p className="text-center mb-6 md:mb-12 text-sm md:text-base text-gray">
          Upskill with guided programs designed to launch high-growth careers.
        </p>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-1000 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides * 3 }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(screenSize === "mobile"
                      ? infinitePrograms.slice(
                          slideIndex * 1,
                          slideIndex * 1 + 1
                        )
                      : screenSize === "tablet"
                      ? infinitePrograms.slice(
                          slideIndex * 2,
                          slideIndex * 2 + 2
                        )
                      : infinitePrograms.slice(
                          slideIndex * 3,
                          slideIndex * 3 + 3
                        )
                    ).map((program, index) => (
                      <div
                        key={`${slideIndex}-${index}`}
                        data-aos="fade-up" // Add AOS animation
                        data-aos-duration="1500"
                        className="bg-white rounded-xl border border-gray/50 hover:shadow-xl transition-shadow flex flex-col h-full"
                      >
                        <div className="p-4 pb-0">
                          <img
                            src={program.bg || "/placeholder.svg"}
                            alt=""
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex flex-col flex-grow h-full p-4 pb-0">
                          <h3 className="font-semibold text-lg mb-2 text-gray-800 text-center">
                            {program.title}
                          </h3>
                          <h5 className="text-sm text-center text-gray-600">
                            {program.subtitle}
                          </h5>
                          <div className="flex justify-between items-center text-sm text-gray-600 mb-4 mt-4">
                            <span className="flex items-center text-xs">
                              <Users className="w-4 h-4 mr-1" />
                              {program.time}
                            </span>
                            <span className="flex items-center text-xs">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {program.questions}
                            </span>
                            <span className="flex items-center text-xs">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {program.learners}
                            </span>
                          </div>
                          <div className="flex flex-grow justify-between items-center mb-4 text-sm">
                            <div className="flex items-center">
                              <div className="flex text-yellow-400">
                                {"★".repeat(Math.floor(program.rating))}
                              </div>
                              <span className="ml-2 text-gray-600">
                                {program.rating} (Ratings)
                              </span>
                            </div>
                            <div>
                              <h1>
                                Starting from{" "}
                                <span className="font-bold text-primary text-base">
                                  19.99 CAD
                                </span>
                              </h1>
                            </div>
                          </div>
                        </div>

                        <div className="flex-grow mt-auto mb-4">
                          <hr className="border-gray/50" />
                          <div className="mt-4 flex justify-between items-center flex-col gap-3">
                            <Link to={"/topics"}>
                              <div className="p-2 bg-blue-50 hover:text-white hover:bg-gradient-to-r hover:from-[#189EFE] hover:to-[#0E5F98] rounded-lg flex items-center gap-2 group">
                                <img
                                  src={traind}
                                  alt="Train"
                                  className="w-5 h-5 group-hover:hidden"
                                />
                                <img
                                  src={trainw}
                                  alt="Train Hover"
                                  className="w-6 h-6 hidden group-hover:block"
                                />
                                <span>Train with LearninGPT</span>
                              </div>
                            </Link>
                            <Link to={"/topics"}>
                              <div className="p-2 bg-blue-50 hover:text-white hover:bg-gradient-to-r hover:from-[#189EFE] hover:to-[#0E5F98] rounded-lg flex items-center gap-2 group">
                                <img
                                  src={startd}
                                  alt="Start"
                                  className="w-5 h-5 group-hover:hidden"
                                />
                                <img
                                  src={startw}
                                  alt="Start Hover"
                                  className="w-6 h-6 hidden group-hover:block"
                                />
                                <span>Start Exam Simulator</span>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Slide navigation buttons vertically centered */}
            <div className="absolute inset-y-0 -left-4 lg:-left-8 flex items-center z-50">
              <button
                onClick={handlePrevSlide}
                className="text-white p-2 rounded-full bg-primary/50 hover:bg-primary/70 transition-all duration-200 cursor-pointer"
                type="button"
                aria-label="Previous Slide"
              >
                <FaArrowLeft />
              </button>
            </div>
            <div className="absolute inset-y-0 -right-4 lg:-right-8 flex items-center z-50">
              <button
                onClick={handleNextSlide}
                className="text-white p-2 rounded-full bg-primary/50 hover:bg-primary/70 transition-all duration-200 cursor-pointer"
                type="button"
                aria-label="Next Slide"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8 mb-4 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide % totalSlides === index
                  ? "bg-primary"
                  : "bg-primary/50"
              }`}
            />
          ))}
        </div>
        {/* Slide Controls */}
        <Link to={"/topics"}>
          <div className="text-center mt-8">
            <Button rounded="lg" padding="px-6 py-2">
              Explore All Categories
            </Button>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default LearningPrograms;
