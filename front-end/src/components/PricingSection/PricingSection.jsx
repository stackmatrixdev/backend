import React, { useEffect } from "react";
import pricing1 from "../../assets/images/pricing1.png";
import pricing2 from "../../assets/images/pricing2.png";
import pricing3 from "../../assets/images/pricing3.png";
import tic from "../../assets/images/tic.png";
import Button from "../Shared/Button";
import sales from "../../assets/images/sales.png";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

const PricingSection = () => {
  const plans = [
    {
      title: "Exam Simulator Only",
      price: "19.99 CAD",
      period: "Per Month",
      color: "bg-[#A1D1FF]",
      features: ["Mock Exams & Practice"],
      buttonText: "Choose Plan",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      image: pricing3,
      scale: false,
    },
    {
      title: "Full Access",
      price: "24.99 CAD",
      period: "Per Month",
      color: "bg-[#42A5FF]",
      popular: true,
      features: ["Quiz", "Chatbot", "Docs"],
      originalPrice: "29.99 CAD",
      buttonText: "Choose Plan",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      image: pricing2,
      scale: true,
    },
    {
      title: "AI Coach Only",
      price: "19.99 CAD",
      period: "Per Month",
      color: "bg-[#7ED6D1]",
      features: ["Chat + Smart Guidance"],
      buttonText: "Choose Plan",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      image: pricing1,
      scale: false,
    },
  ];

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration for the animation
      once: false, // Animation happens only once
    });
  }, []);

  return (
    <section className="py-5 md:pt-10 lg:pt-10 pb-8 md:pb-12 lg:pb-28 bg-[#F9FAFB] ">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-2 md:mb-4">
          <div className="inline-flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
            <img src={sales} alt="" />
            <span className="ml-2">
              Special Launch Offer - 50% Off First Month
            </span>
          </div>
        </div>

        <div className="text-center mb-3 md:mb-12">
          <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 text-gray-800">
            Pricing
          </h2>
          <p className="text-gray text-sm md:text-base">
            Flexible AI learning plans for individuals and enterprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-12 mx-auto max-w-6xl relative">
          <div
            aria-hidden="true"
            className="pointer-events-none z-10 absolute bottom-0 sm:bottom-10 lg:-bottom-36 left-0 sm:left-0 lg:-left-36 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[320px] lg:h-[320px] rounded-full border-[10px] sm:border-[12px] lg:border-[36px] border-circle/50"
          />
          {plans.map((plan, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay={index * 200} // Stagger the animation delay
              className={`bg-white z-10 rounded-lg overflow-hidden shadow-lg flex flex-col h-full ${plan.scale ? "md:transform md:scale-110" : ""}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-[#FFB563] text-white px-3 py-1 rounded-full text-xs font-medium z-10">
                  Best Deal
                </div>
              )}

              {/* Header with Icon */}
              <div className={`${plan.color} p-8 text-white text-center relative flex flex-col items-center`}>
                <img src={plan.image} alt="" />
                <h3 className="text-xl font-semibold my-2">{plan.title}</h3>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Features */}
                <div className="flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center mb-2">
                      <img src={tic} alt="" />
                      <span className="ml-2 text-gray-700 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="mb-4 flex-1">
                  {plan.originalPrice && (
                    <div className="text-gray line-through text-sm mb-1">
                      {plan.originalPrice}
                    </div>
                  )}
                  <div className="text-2xl font-bold text-primary mb-1">
                    {plan.price}
                  </div>
                  <div className="text-gray-600 text-sm">{plan.period}</div>
                </div>

                {/* Button - Pushed to bottom */}
                <div className="mt-auto">
                  <Button rounded="lg">{plan.buttonText}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
