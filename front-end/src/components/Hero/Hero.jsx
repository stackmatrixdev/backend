import { useState, useEffect, useRef } from "react";
import hero1 from "../../assets/images/herobg.png"; // First background image
import hero2 from "../../assets/images/hero2.png"; // Second background image
import hero3 from "../../assets/images/hero3.png"; // Third background image
import badge from "../../assets/images/icon-badge.png";
import badge2 from "../../assets/images/icon/badge2.png";
import badge3 from "../../assets/images/icon/badge3.png";
import one from "../../assets/images/one.png";
import two from "../../assets/images/two.png";
import three from "../../assets/images/three.png";
import four from "../../assets/images/four.png";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import banner from "../../assets/images/icon/banner.png";
import banner2 from "../../assets/images/icon/banner2.png";
import banner3 from "../../assets/images/icon/banner3.png";
import banner4 from "../../assets/images/icon/banner4.png";
import youtube from "../../assets/images/icon/youtube.png";
import head from "../../assets/images/icon/head.png";
import track from "../../assets/images/icon/track.png";
import unlimited from "../../assets/images/icon/unlimited.png";
import slide1 from "../../assets/images/slide1.png";
import slide2 from "../../assets/images/slide2.png";
import slide3 from "../../assets/images/slide3.png";
import Aos from "aos";
import "aos/dist/aos.css"; // Import AOS styles

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // To manage animation state
  const intervalRef = useRef(null); // Store interval ID

  const slides = [
    {
      id: 1,
      badge: { text: "AI-Powered Learning Platform", icon: badge },
      title: "Master Your Exams with LearnInGPT",
      description:
        "Experience personalized learning with our AI assistant. Take your skills from textbook to real-world, and accelerate your learning journey.",
      primaryButton: {
        text: "Train with LearnInGPT",
        icon: banner,
        color: "bg-[#04AA0B]",
        go: "/topics",
      },
      secondaryButton: {
        text: "Start Exam Simulator",
        icon: banner2,
        color: "bg-gradient-to-r from-[#189EFE] to-[#0E5F98]",
        go: "/topics",
      },

      features: [
        { icon: youtube, text: "Quality Video Courses" },
        { icon: head, text: "Learn with AI" },
        // { icon: MessageCircle, text: "Live Support" },
      ],
    },
    {
      id: 2,
      badge: { text: "Train Your Brain with Smart Tech", icon: badge2 },
      title: "Practice Smart, Not Hard",
      description:
        "Access hundreds of quizzes with instant feedback, tailored to your skill level.",
      primaryButton: {
        text: "Try AI-Powered Learning",
        icon: banner3,
        color: "bg-gradient-to-r from-[#189EFE] to-[#0E5F98]",
        go: "/topics",
      },
      secondaryButton: null,

      features: [
        { icon: youtube, text: "Quality Video Courses" },
        { icon: track, text: "Track Your Progress" },
      ],
    },
    {
      id: 3,
      badge: { text: "Smarter Practice, Higher Scores", icon: badge3 },
      title: "Track Your Progress",
      description:
        "Monitor your learning and see your growth track from Day One.",
      primaryButton: {
        text: "Create Free Account",
        icon: banner4,
        color: "bg-gradient-to-r from-[#189EFE] to-[#0E5F98]",
        go: "/register",
      },
      secondaryButton: null,

      features: [
        { icon: youtube, text: "Quality Video Courses" },
        { icon: unlimited, text: "Unlimited Support" },
      ],
    },
  ];

  const avatar = [
    { image: four },
    { image: three },
    { image: two },
    { image: one },
  ];
  useEffect(() => {
    // Initialize AOS after component mounts
    Aos.init({
      duration: 2000, // You can adjust the duration globally here
    });
  }, []);
  // Auto-slide functionality with pause on interaction
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isAnimating) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 3000);
    return () => clearInterval(intervalRef.current); // Cleanup interval when component unmounts
  }, [slides.length, isAnimating]);

  // Stop auto-slide on manual slide change
  const handleManualSlideChange = (index) => {
    clearInterval(intervalRef.current);
    setCurrentSlide(index);
    setIsAnimating(true); // Trigger animation when manually changing the slide
    setTimeout(() => {
      setIsAnimating(false);
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 3000);
    }, 500); // Reset the animation state after the transition
  };

  const currentSlideData = slides[currentSlide];

  // Determine the background image based on the current slide
  const backgroundImages = [hero1, hero2, hero3]; // Array of background images
  const currentBackgroundImage = backgroundImages[currentSlide];

  // Helper to restart interval
  const restartInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
  };

  // Handle next and previous slide navigation
  const handleNextSlide = () => {
    clearInterval(intervalRef.current);
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => {
      setIsAnimating(false);
      restartInterval();
    }, 500);
  };

  const handlePrevSlide = () => {
    clearInterval(intervalRef.current);
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length); // To handle circular navigation
    setTimeout(() => {
      setIsAnimating(false);
      restartInterval();
    }, 500);
  };
  const renderImage = (src) => {
    return <img src={src} alt="Banner Icon" />;
  };

  // Responsive state for mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile slide images
  const mobileImages = [slide1, slide2, slide3];

  return (
    <div
      className={`relative flex items-center overflow-hidden lg:h-[90vh] w-full`}
      style={
        isMobile
          ? { background: "none" }
          : {
              backgroundImage: `url(${currentBackgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
      }
    >
      {/* Overlay for better readability */}
      {!isMobile && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#199DFE]/50 via-[#179DFF]/10 to-[#179DFF]/6"></div>
      )}

      <div
        className={`relative w-11/12 2xl:w-10/12 flex mx-auto ${
          isMobile ? "flex-col" : ""
        }`}
      >
        {/* Mobile: Show slide image above content */}
        {isMobile && (
          <div className="w-full flex flex-col  gap-4 justify-center items-center pt-4">
            <div className="relative">
              <img
                src={mobileImages[currentSlide]}
                alt="Slide"
                className="rounded-xl shadow-lg"
              />
              {isMobile && (
                <div
                  className={`absolute flex items-center justify-between z-30 ${
                    isMobile ? "w-full justify-center" : ""
                  }`}
                >
                  <button
                    onClick={handlePrevSlide}
                    className="text-white left-0 p-2 rounded-full bg-primary/70 hover:bg-primary/70 transition-all duration-200 cursor-pointer"
                    type="button"
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="text-white left-0 p-2 rounded-full bg-primary/70 hover:bg-primary/70 transition-all duration-200 cursor-pointer"
                    type="button"
                  >
                    <FaArrowRight />
                  </button>
                </div>
              )}
              {/* badge for mobile */}
              {isMobile && (
                <div>
                  <div className="flex flex-col gap-2 left-0 absolute bottom-2">
                    {/* Static Badge 1 - Top Right */}
                    <div className="left-0 bg-white/65 backdrop-blur-sm rounded-3xl px-2 shadow-lg z-20">
                      <div className="flex items-center space-x-2">
                        <img src={youtube} alt="" />
                        <span className="text-sm font-medium py-1 text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                          {currentSlideData.features[0]?.text}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 right-0  absolute bottom-2">
                    {/* Static Badge 2 - Vertically Centered */}
                    <div className="right-0 bg-white/65 backdrop-blur-sm rounded-3xl px-2 py-1 shadow-lg z-20">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          {renderImage(currentSlideData.features[1]?.icon)}
                          <span className="text-sm font-medium text-gray-700">
                            {currentSlideData.features[1]?.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Navigation Dots */}
            {isMobile && (
              <div className="flex space-x-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleManualSlideChange(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-blue-500 scale-125"
                        : "bg-blue-200 hover:bg-blue-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <div
          className={`grid grid-cols-1 mt-10 sm:mt-0 ${
            isMobile ? "w-full" : "w-1/2"
          } gap-12 items-center sm:min-h-[600px] sm:h-full`}
        >
          {/* Left Content */}
          <div
            className={`space-y-4 lg:space-y-8 z-10 relative ${
              isMobile ? "w-full" : "w-4/6 2xl:w-5/6"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full sm:px-4 sm:py-2 text-sm font-medium text-primary border-blue-100">
              <div className="">
                <img
                  src={currentSlideData.badge.icon || "/placeholder.svg"}
                  alt=""
                />
              </div>
              <span>{currentSlideData.badge.text}</span>
            </div>
            {/* Title */}
            <div
              data-aos="fade-up"
              data-aos-duration="3000"
              className="space-y-2 lg:space-y-4"
            >
              <h1 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 leading-tight">
                {currentSlideData.title}
              </h1>
              <p className="text-base xl:text-lg 2xl:text-xl text-gray-600 leading-relaxed max-w-lg md:text-base">
                {currentSlideData.description}
              </p>
            </div>
            {/* Buttons */}
            <div
              className={`flex ${
                isMobile ? "flex-col" : "flex-col xl:flex-row"
              } gap-2 2xl:gap-4`}
            >
              <Link
                to={currentSlideData.primaryButton.go}
                className={`${currentSlideData.primaryButton.color} whitespace-nowrap text-white px-2 xl:px-3 2xl:px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg`}
              >
                {renderImage(currentSlideData.primaryButton.icon)}
                <span>{currentSlideData.primaryButton.text}</span>
              </Link>
              {currentSlideData.secondaryButton && (
                <Link
                  to={currentSlideData.secondaryButton.go}
                  className={`${currentSlideData.secondaryButton.color} whitespace-nowrap text-white px-2 xl:px-3 2xl:px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg`}
                >
                  {renderImage(currentSlideData.secondaryButton.icon)}
                  <span>{currentSlideData.secondaryButton.text}</span>
                </Link>
              )}
            </div>
            {/* User Avatars and Stats */}
            <div className="flex lg:flex-row items-center space-x-4 pt-2 xl:pt-4 2xl:pt-8">
              <div className="flex -space-x-4">
                {avatar.map((icon, idx) => (
                  <img
                    key={idx}
                    src={icon.image || "/placeholder.svg"}
                    alt=""
                  />
                ))}
              </div>
              <div className="md:hidden lg:block">
                <div className="font-semibold text-gray">
                  <span className="text-primary">10k</span> Enrollment
                </div>
              </div>
            </div>
            {/* Navigation Dots */}
            {!isMobile && (
              <div className="flex space-x-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleManualSlideChange(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-blue-500 scale-125"
                        : "bg-blue-200 hover:bg-blue-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Slide Controls */}
          {!isMobile && (
            <div
              className={`absolute bottom-10 lg:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 z-30 ${
                isMobile ? "w-full justify-center" : ""
              }`}
            >
              <button
                onClick={handlePrevSlide}
                className="text-white p-2 rounded-full bg-primary/50 hover:bg-primary/70 transition-all duration-200 cursor-pointer"
                type="button"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={handleNextSlide}
                className="text-white p-2 rounded-full bg-primary/50 hover:bg-primary/70 transition-all duration-200 cursor-pointer"
                type="button"
              >
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
        {/* Right side badges only for non-mobile */}
        {!isMobile && (
          <div className="w-1/2 relative">
            {/* Static Badge 1 - Top Right */}
            <div className="absolute top-[45%]  transform -translate-y-1/2 -left-24 bg-white/95 backdrop-blur-sm rounded-3xl px-4 py-2 shadow-lg z-20">
              <div className="flex items-center space-x-2">
                <img src={youtube} alt="" />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] lg:max-w-[150px]">
                  {currentSlideData.features[0]?.text}
                </span>
              </div>
            </div>
            {/* Static Badge 2 - Vertically Centered */}
            <div className="absolute top-[55%] transform -translate-y-1/2 -left-16  bg-white/95 backdrop-blur-sm rounded-3xl px-4 py-2 shadow-lg z-20">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {renderImage(currentSlideData.features[1]?.icon)}
                  <span className="text-sm font-medium text-gray-700">
                    {currentSlideData.features[1]?.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
