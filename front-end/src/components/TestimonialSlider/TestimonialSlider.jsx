import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import icon from "../../assets/images/thunder.png";
import profile from "../../assets/images/customerProfile.png";

const TestimonialSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Kathryn Murphy",
      role: "IT Student",
      image: profile,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea com",
      rating: 5,
    },
    {
      id: 2,
      name: "John Anderson",
      role: "Software Engineer",
      image: profile,
      text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      rating: 5,
    },
    {
      id: 3,
      name: "Sarah Williams",
      role: "UX Designer",
      image: profile,
      text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
      rating: 5,
    },
  ];

  // Next slide
  const nextSlide = () => {
    if (currentSlide >= testimonials.length) {
      setIsTransitioning(false);
      setCurrentSlide(1);
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  // Prev slide
  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-primary text-primary" : "text-gray-300"
        }`}
      />
    ));
  };

  // Auto slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  // Handle transition end for infinite loop
  const handleTransitionEnd = () => {
    if (currentSlide >= testimonials.length) {
      setIsTransitioning(false);
      setCurrentSlide(1);
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
  };

  return (
    <div className="relative z-10 bg-[#F9FAFB] py-16">
      {/* Circular background - z-0 so it's behind testimonial content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden 2xl:block top-0 sm:top-10 lg:-top-40 right-0 sm:right-0 lg:-right-0 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[320px] lg:h-[320px] rounded-full border-[10px] sm:border-[12px] lg:border-[36px] border-circle/50 z-0"
        style={{ clipPath: "inset(50% 0 0 0) "}}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none hidden xl:block absolute bottom-0 sm:bottom-10 lg:top-32 right-0 sm:right-0 lg:right-44 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[320px] lg:h-[320px] rounded-full border-[10px] sm:border-[12px] lg:border-[36px] border-circle/50"
      />
      <div className="flex justify-center mb-6 z-10 relative">
        <div className="inline-flex items-center space-x-2 bg-primary/10 border border-blue-100 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-primary">
          <div>
            <img src={icon} alt="badge" />
          </div>
          <span>Let’s Join With Us</span>
        </div>
      </div>
      <h1 className="text-3xl font-semibold text-center mb-4">
        Feedback’s From Our Student
      </h1>
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 flex items-center justify-center z-10 relative">
        <div className="relative w-full">
          {/* Slider */}
          <div className="relative overflow-hidden">
            <div
              className={`flex ${
                isTransitioning
                  ? "transition-transform duration-300 ease-in-out"
                  : ""
              }`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {[...testimonials, testimonials[0]].map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left card */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray/50">
                      <div className="flex items-start space-x-4 mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            {testimonial.text}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gray/50 pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {testimonial.name}
                            </h3>
                            <p className="text-primary text-sm">
                              {testimonial.role}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {renderStars(testimonial.rating)}
                            <span className="text-sm text-gray-600 ml-2">
                              ({testimonial.rating})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right card (duplicate) */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray/50">
                      <div className="flex items-start space-x-4 mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            {testimonial.text}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gray/50 pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {testimonial.name}
                            </h3>
                            <p className="text-primary text-sm">
                              {testimonial.role}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {renderStars(testimonial.rating)}
                            <span className="text-sm text-gray-600 ml-2">
                              ({testimonial.rating})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray/50"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray/50"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentSlide
                    ? "bg-blue-500"
                    : index === (currentSlide + 1) % testimonials.length
                    ? "bg-blue-400"
                    : "bg-blue-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
